import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Tarjeta');

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor, completa los campos requeridos (Título, Monto, Fecha).');
      return;
    }

    if (isNaN(amount)) {
      Alert.alert('Error', 'El monto debe ser un número válido.');
      return;
    }

    await addDebt({
      title,
      amount: parseFloat(amount),
      dueDate,
      description,
      type,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="title-input"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="amount-input"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31) *"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="date-input"
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="desc-input"
      />

      <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={theme.colors.primary}
        testID="save-button"
      >
        Guardar Deuda
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
    paddingBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  radioTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
