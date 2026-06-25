import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddEditDebtScreen({ navigation, route }) {
  const { debts, addDebt, updateDebt } = useDebts();
  const debtId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (debtId) {
      const debt = debts.find(d => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDescription(debt.description || '');
        setDueDate(debt.dueDate || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      description,
      dueDate,
    };

    if (debtId) {
      updateDebt(debtId, debtData);
    } else {
      addDebt({ ...debtData, id: uuidv4(), isPaid: false });
    }
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

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
      </RadioButton.Group>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-description"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
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
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  }
});
