import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { debts, addDebt, updateDebt } = useDebts();
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate || '');
        setDescription(debtToEdit.description || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor, completa el título y el monto.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor, ingresa un monto válido.');
      return;
    }

    const debtData = { title, amount, type, dueDate, description };

    if (isEditing) {
      await updateDebt(debtId, debtData);
    } else {
      await addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
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

      <Text style={styles.label}>Tipo de deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" />
        <RadioButton.Item label="Persona" value="Persona" />
        <RadioButton.Item label="Individual" value="Individual" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        placeholder="DD/MM/AAAA"
        testID="input-due-date"
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

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
    marginBottom: 8,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
