import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function AddDebtScreen() {
  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual'); // 'Tarjeta', 'Crédito', 'Persona', 'Individual'

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    await addDebt({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título o Descripción"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="Individual" />
          <Text>Individual</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjeta" />
          <Text>Tarjeta</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Crédito" />
          <Text>Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Persona" />
          <Text>Persona</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        Guardar Deuda
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
  label: {
    fontSize: 16,
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
    paddingVertical: 6,
  }
});
