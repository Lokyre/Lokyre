import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddEditDebtScreen() {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setName(debtToEdit.name);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre y un monto válido.");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "El monto debe ser un número positivo.");
      return;
    }

    const debtData = {
      name: name.trim(),
      amount: parseFloat(amount),
      type,
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre / Descripción"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        testID="input-name"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.radioTitle}>Tipo de deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          <Text>Tarjeta</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Crédito" testID="radio-credito" />
          <Text>Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Persona" testID="radio-persona" />
          <Text>Persona</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individual" testID="radio-individual" />
          <Text>Individual</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="save-button"
      >
        {isEditing ? "Actualizar Deuda" : "Guardar Deuda"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  radioTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  }
});
