import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const editingId = route.params?.id;
  const isEditing = !!editingId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [editingId, debts]);

  const handleSave = async () => {
    if (!title || !amount) {
      alert('Por favor completa título y monto');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
      isPaid: isEditing ? debts.find(d => d.id === editingId).isPaid : false,
    };

    if (isEditing) {
      await updateDebt(editingId, debtData);
    } else {
      await addDebt(debtData);
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
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-date"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-desc"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
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
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
