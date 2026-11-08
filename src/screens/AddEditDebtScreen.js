import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt, debts } = useDebts();
  const theme = useTheme();

  const editingId = route.params?.id || null;
  const existingDebt = editingId ? debts.find(d => d.id === editingId) : null;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingDebt) {
      setTitle(existingDebt.title);
      setAmount(existingDebt.amount.toString());
      setCategory(existingDebt.category);
      setNotes(existingDebt.notes || '');
    }
  }, [existingDebt]);

  const handleSave = async () => {
    if (!title || !amount) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor ingrese título y monto');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'Por favor ingrese título y monto');
      }
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      category,
      notes,
      status: existingDebt ? existingDebt.status : 'Pendiente',
    };

    if (editingId) {
      await updateDebt(editingId, debtData);
    } else {
      await addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo Banco)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="title-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="amount-input"
      />

      <Text style={styles.sectionLabel}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioGroup}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Notas (Opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline={true}
        numberOfLines={4}
        style={styles.input}
        mode="outlined"
        testID="notes-input"
      />

      <Button mode="contained" onPress={handleSave} style={styles.saveButton} testID="save-button">
        {editingId ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  radioGroup: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
