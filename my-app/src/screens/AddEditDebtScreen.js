import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddEditDebtScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useDebts();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [description, setDescription] = useState('');

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === id);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(String(debtToEdit.amount));
        setCategory(debtToEdit.category);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [id, debts]);

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto válido.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert('Error', 'El monto debe ser un número mayor a cero.');
        return;
    }

    const debtData = {
      title: title.trim(),
      amount: numericAmount,
      category,
      description: description.trim()
    };

    if (isEditing) {
      await updateDebt(id, debtData);
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
        mode="outlined"
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.sectionTitle}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {CATEGORIES.map(cat => (
          <RadioButton.Item
            key={cat}
            label={cat}
            value={cat}
            testID={`radio-${cat}`}
          />
        ))}
      </RadioButton.Group>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={[styles.input, styles.textArea]}
        testID="input-description"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
        {isEditing ? 'Guardar Cambios' : 'Agregar Deuda'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333'
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 6,
  }
});

export default AddEditDebtScreen;
