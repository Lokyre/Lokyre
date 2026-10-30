import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function AddDebtScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [dueDate, setDueDate] = useState('');

  const { addDebt } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleAdd = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
    });

    setTitle('');
    setAmount('');
    setType('Individuales');
    setDueDate('');

    navigation.navigate('Inicio');
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Nueva Deuda</Title>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="titleInput"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="amountInput"
      />

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="DD/MM/AAAA"
        testID="dateInput"
      />

      <Title style={styles.subtitle}>Tipo de Deuda</Title>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Individuales" value="Individuales" testID="radio-Individuales" />
        <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" testID="radio-Créditos" />
        <RadioButton.Item label="Personas" value="Personas" testID="radio-Personas" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleAdd} style={styles.button} testID="submitButton">
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
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
