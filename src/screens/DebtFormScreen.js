import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtFormScreen({ navigation, route }) {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const theme = useTheme();

  const editingDebt = route.params?.debt;

  const [name, setName] = useState(editingDebt ? editingDebt.name : '');
  const [amount, setAmount] = useState(editingDebt ? String(editingDebt.amount) : '');
  const [type, setType] = useState(editingDebt ? editingDebt.type : 'Tarjeta');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la deuda.');
      return;
    }
    if (!amount.trim() || isNaN(amount)) {
      Alert.alert('Error', 'Por favor ingresa un monto válido.');
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      type,
    };

    if (editingDebt) {
      updateDebt(editingDebt.id, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.formContainer}>
        <TextInput
          label="Nombre o Descripción"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          testID="name-input"
        />
        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          testID="amount-input"
        />

        <Text style={styles.label}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <RadioButton value="Tarjeta" testID="radio-tarjeta" />
              <Text>Tarjeta de Crédito</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Préstamo" testID="radio-prestamo" />
              <Text>Préstamo</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Personal" testID="radio-personal" />
              <Text>Personal (Amigo/Familiar)</Text>
            </View>
          </View>
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          testID="save-button"
        >
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  radioContainer: {
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
  },
});
