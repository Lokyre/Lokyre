import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos requeridos (Título, Monto, Fecha de vencimiento).');
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
        mode="outlined"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" />
        <RadioButton.Item label="Persona" value="Persona" />
        <RadioButton.Item label="Individual" value="Individual" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
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
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
