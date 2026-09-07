import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      notes,
      isPaid: false,
      dateAdded: new Date().toISOString(),
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título / Nombre"
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

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" />
        <RadioButton.Item label="Persona" value="Persona" />
        <RadioButton.Item label="Otro" value="Otro" />
      </RadioButton.Group>

      <TextInput
        label="Notas (Opcional)"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
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
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
