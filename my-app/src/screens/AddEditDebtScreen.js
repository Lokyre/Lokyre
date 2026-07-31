import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddEditDebtScreen() {
  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const editingId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingId) {
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

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos requeridos (Título, Monto, Fecha)');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount) || 0,
      type,
      dueDate,
      description,
    };

    if (editingId) {
      updateDebt(editingId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}><RadioButton value="Tarjeta" testID="radio-tarjeta" /><Text>Tarjeta</Text></View>
          <View style={styles.radioItem}><RadioButton value="Crédito" testID="radio-credito" /><Text>Crédito</Text></View>
          <View style={styles.radioItem}><RadioButton value="Persona" testID="radio-persona" /><Text>Persona</Text></View>
          <View style={styles.radioItem}><RadioButton value="Individual" testID="radio-individual" /><Text>Individual</Text></View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-due-date"
      />
      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-description"
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
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
