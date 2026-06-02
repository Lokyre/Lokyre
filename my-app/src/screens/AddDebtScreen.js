import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      alert('El monto debe ser un número válido.');
      return;
    }

    await addDebt({
      title,
      amount: parsedAmount,
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Añadir Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Deuda</Text>
        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            { value: 'Tarjeta', label: 'Tarjeta' },
            { value: 'Crédito', label: 'Crédito' },
            { value: 'Persona', label: 'Persona' },
            { value: 'Individual', label: 'Individual' },
          ]}
          style={styles.segment}
        />

        <TextInput
          label="Fecha de vencimiento (ej. 2024-12-31)"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          style={styles.input}
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

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Guardar Deuda
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  segment: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
