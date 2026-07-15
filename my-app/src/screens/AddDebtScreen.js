import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el título y el monto.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Por favor, ingresa un monto válido.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: numericAmount,
      type,
      description,
      isPaid: false,
      dueDate: new Date().toISOString(), // simple current date for now
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
        mode="outlined"
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

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
  radioContainer: {
    marginBottom: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fafafa',
  },
  radioLabel: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: '#333',
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 6,
  },
});
