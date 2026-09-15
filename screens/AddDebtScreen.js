import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('individual');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      alert('Por favor ingrese título y monto');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      description,
      date: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Alquiler, Juan, Tarjeta Visa)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Affix text="$" />}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tipo de Deuda
      </Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Individual / Otros" value="individual" />
        <RadioButton.Item label="Tarjeta de Crédito" value="tarjeta" />
        <RadioButton.Item label="Crédito / Préstamo" value="credito" />
        <RadioButton.Item label="Persona" value="persona" />
      </RadioButton.Group>

      <TextInput
        label="Descripción o Notas (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
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
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
});
