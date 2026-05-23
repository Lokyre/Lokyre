import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title || !totalAmount) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto total debe ser un número válido mayor a 0.');
      return;
    }

    const newDebt = {
      title,
      type,
      totalAmount: amount,
      dueDate,
      createdAt: new Date().toISOString(),
      payments: []
    };

    await addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.header}>Agregar Nueva Deuda</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo Auto)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Tarjetas', label: 'Tarjetas' },
          { value: 'Créditos', label: 'Créditos' },
          { value: 'Personas', label: 'Personas' },
          { value: 'Individuales', label: 'Indiv.' },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Monto Total"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        placeholder="DD/MM/AAAA"
        style={styles.input}
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
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  segmented: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default AddDebtScreen;
