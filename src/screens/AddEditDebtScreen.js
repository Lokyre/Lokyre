import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debtId } = route.params || {};
  const { debts, addDebt, updateDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState('');

  const isEditing = !!debtId;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setCategory(debtToEdit.category);
        setDueDate(debtToEdit.dueDate || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      category,
      dueDate,
    };

    if (isEditing) {
      updateDebt({ ...debtData, id: debtId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título / Descripción"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" />
        <RadioButton.Item label="Personas" value="Personas" />
        <RadioButton.Item label="Individuales" value="Individuales" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
