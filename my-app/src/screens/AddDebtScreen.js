import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Surface } from 'react-native-paper';
import { useDebt } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function AddDebtScreen() {
  const { addDebt } = useDebt();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor completa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <TextInput
          testID="input-title"
          label="Título de la deuda"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          testID="input-amount"
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.label}>
          Tipo de deuda:
        </Text>
        <RadioButton.Group onValueChange={(value) => setType(value)} value={type}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Individual" value="Individual" />
        </RadioButton.Group>

        <TextInput
          label="Fecha de Vencimiento (ej. 2023-12-31)"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          mode="outlined"
          style={styles.input}
        />

        <Button testID="btn-save" mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Deuda
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
