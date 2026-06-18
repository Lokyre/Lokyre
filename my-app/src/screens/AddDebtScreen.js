import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Título, Monto, Fecha de Vencimiento)');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Individual" value="Individual" />
        <RadioButton.Item label="Tarjeta" value="Tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" />
        <RadioButton.Item label="Persona" value="Persona" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (DD/MM/YYYY) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-date"
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
