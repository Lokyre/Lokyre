import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebtContext();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor, ingresa el título y el monto.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
      isPaid: false,
    };

    await addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />
      <TextInput
        label="Fecha de vencimiento (Ej: 2023-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-duedate"
      />
      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-description"
      />

      <Title style={styles.radioTitle}>Tipo de Deuda</Title>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
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
  },
  radioTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
