import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Individual');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      description,
      type,
      date: new Date().toISOString(),
      isPaid: false,
    };

    addDebt(newDebt);
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

      <Text style={styles.label}>Tipo de deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Individual', label: 'Individual' },
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
          { value: 'Persona', label: 'Persona' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Descripción (Opcional)"
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
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
