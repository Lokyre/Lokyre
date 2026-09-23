import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditScreen = () => {
  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId, category: initialCategory } = route?.params || {};
  const isEditing = !!debtId;
  const existingDebt = isEditing ? debts.find(d => d.id === debtId) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  useEffect(() => {
    if (existingDebt) {
      setTitle(existingDebt.title);
      setDescription(existingDebt.description || '');
      setAmount(existingDebt.amount.toString());
      setType(existingDebt.type);
    } else if (initialCategory) {
      setType(initialCategory);
    }
  }, [existingDebt, initialCategory]);

  const handleSave = () => {
    if (!title || !amount) {
      if (globalThis.alert) {
         globalThis.alert('Error: Por favor completa el título y el monto.');
      }
      return;
    }

    const debtData = {
      title,
      description,
      amount: parseFloat(amount),
      type
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.headerTitle}>{isEditing ? 'Editar Deuda' : 'Nueva Deuda'}</Title>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
        testID="input-description"
      />

      <View style={styles.radioContainer}>
        <Title style={styles.radioTitle}>Categoría:</Title>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton} testID="btn-save">
        Guardar
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
  headerTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginVertical: 8,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  }
});

export default AddEditScreen;
