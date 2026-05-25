import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Persona');

  const handleSave = () => {
    if (!name || !amount) {
      alert('Por favor completa todos los campos.');
      return;
    }

    addDebt({
      name,
      amount: parseFloat(amount),
      type,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Registrar Nueva Deuda</Text>

      <TextInput
        label="Nombre del acreedor/deudor"
        value={name}
        onChangeText={setName}
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
      />

      <Text variant="labelLarge" style={styles.label}>Tipo de Deuda:</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Persona', label: 'Persona' },
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
        ]}
        style={styles.segmentedButtons}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor="#6200ee"
      >
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  button: {
    paddingVertical: 8,
  },
});
