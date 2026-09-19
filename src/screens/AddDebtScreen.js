import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation, route }) {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);

  const editingDebtId = route?.params?.debtId;
  const editingDebt = editingDebtId ? debts.find(d => d.id === editingDebtId) : null;

  const [description, setDescription] = useState(editingDebt ? editingDebt.description : '');
  const [amount, setAmount] = useState(editingDebt ? editingDebt.amount.toString() : '');
  const [category, setCategory] = useState(editingDebt ? editingDebt.category : 'Tarjetas');

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const handleSave = () => {
    if (!description || !amount) {
      if (globalThis.alert) {
         globalThis.alert('Error: Por favor completa todos los campos.');
      } else {
         Alert.alert('Error', 'Por favor completa todos los campos.');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
      if (globalThis.alert) {
         globalThis.alert('Error: El monto debe ser un número válido.');
      } else {
         Alert.alert('Error', 'El monto debe ser un número válido.');
      }
      return;
    }

    const debtData = {
      description,
      amount: parseFloat(amount),
      category
    };

    if (editingDebt) {
      updateDebt({ ...editingDebt, ...debtData });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{editingDebt ? 'Editar Deuda' : 'Nueva Deuda'}</Title>

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        testID="input-description"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Title style={styles.subtitle}>Categoría</Title>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {categories.map(cat => (
          <RadioButton.Item key={cat} label={cat} value={cat} testID={`radio-${cat}`} />
        ))}
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
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
  }
});
