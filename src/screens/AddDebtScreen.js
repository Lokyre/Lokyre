import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebtContext();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      const errorMsg = 'El título y el monto son obligatorios.';
      if (globalThis.alert) {
        globalThis.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      const errorMsg = 'El monto debe ser un número válido mayor a 0.';
      if (globalThis.alert) {
        globalThis.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      category,
      dueDate,
      notes,
    });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo Auto)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (Opcional, ej. 2023-12-01)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Notas Adicionales (Opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#666',
  },
  radioContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#f4511e',
  },
});
