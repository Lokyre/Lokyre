import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y la cantidad.');
      return;
    }

    addDebt({
      title,
      amount,
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Cantidad"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-duedate"
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-desc"
      />

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
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddDebtScreen;
