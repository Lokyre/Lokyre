import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor, completa el título y el monto.');
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

    addDebt(newDebt);
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
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioRow}>
            <Text>Individual</Text>
            <RadioButton value="Individual" testID="radio-individual" />
          </View>
          <View style={styles.radioRow}>
            <Text>Tarjeta</Text>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          </View>
          <View style={styles.radioRow}>
            <Text>Crédito</Text>
            <RadioButton value="Crédito" testID="radio-credito" />
          </View>
          <View style={styles.radioRow}>
            <Text>Persona</Text>
            <RadioButton value="Persona" testID="radio-persona" />
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31)"
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
        style={styles.input}
        testID="input-description"
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
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
