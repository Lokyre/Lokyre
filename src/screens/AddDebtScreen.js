import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor completa todos los campos.');
      } else {
        alert('Por favor completa todos los campos.');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
      if (Platform.OS === 'web') {
        globalThis.alert('El monto debe ser un número válido.');
      } else {
        alert('El monto debe ser un número válido.');
      }
      return;
    }

    const newDebt = {
      id: uuidv4(),
      description: description.trim(),
      amount: parseFloat(amount).toFixed(2),
      category,
      date: new Date().toISOString(),
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {categories.map(cat => (
          <RadioButton.Item
            key={cat}
            label={cat}
            value={cat}
            color={theme.colors.primary}
          />
        ))}
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

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
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 5,
  },
});
