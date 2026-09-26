import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddDebtScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt, getDebt } = useDebts();
  const editingId = route.params?.debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingId) {
      const debt = getDebt(editingId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
      }
    }
  }, [editingId]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
    };

    if (editingId) {
      updateDebt({ ...debtData, id: editingId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título o Descripción"
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

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-due-date"
      />

      <Text variant="titleMedium" style={styles.radioLabel}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        {DEBT_TYPES.map((t) => (
          <RadioButton.Item key={t} label={t} value={t} testID={`radio-${t}`} />
        ))}
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        {editingId ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  radioLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  }
});

export default AddDebtScreen;
