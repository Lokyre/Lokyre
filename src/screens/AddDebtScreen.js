import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor completa todos los campos.');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'Por favor completa todos los campos.');
      }
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type: category,
      status: 'pendiente',
      date: new Date().toISOString(),
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título de la deuda"
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

        <Text style={styles.label}>Categoría</Text>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          {CATEGORIES.map(cat => (
            <RadioButton.Item key={cat} label={cat} value={cat} testID={`radio-${cat}`} />
          ))}
        </RadioButton.Group>

        <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
