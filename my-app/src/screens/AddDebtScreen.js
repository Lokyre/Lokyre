import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('tarjeta'); // tarjeta, credito, persona, individual
  const [dueDate, setDueDate] = useState('');

  const handleSave = async () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Por favor ingresa nombre y monto.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número válido.');
      return;
    }

    const newDebt = {
      name,
      amount: parseFloat(amount),
      type,
      dueDate,
    };

    await addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre / Concepto</Text>
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        placeholder="Ej. Tarjeta de Crédito, Juan, etc."
        style={styles.input}
      />

      <Text style={styles.label}>Monto</Text>
      <TextInput
        mode="outlined"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Ej. 1500"
        style={styles.input}
      />

      <Text style={styles.label}>Fecha de Vencimiento (opcional)</Text>
      <TextInput
        mode="outlined"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="DD/MM/AAAA"
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="tarjeta" />
        <RadioButton.Item label="Crédito" value="credito" />
        <RadioButton.Item label="Persona" value="persona" />
        <RadioButton.Item label="Individual" value="individual" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  input: { marginBottom: 15 },
  button: { marginTop: 20, padding: 5 },
});
