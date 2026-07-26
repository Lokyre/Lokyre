import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor llena los campos obligatorios (Título, Monto, Fecha de Vencimiento).');
      return;
    }

    const newDebt = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description
    };

    await addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda *"
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (DD/MM/AAAA) *"
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
        testID="input-desc"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  radioContainer: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 40,
  }
});

export default AddDebtScreen;
