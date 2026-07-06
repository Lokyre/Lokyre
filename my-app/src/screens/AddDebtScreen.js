import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      setError('Por favor completa todos los campos requeridos (*)');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('El monto debe ser un número válido mayor a 0');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount,
      dueDate,
      description,
      type,
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant="headlineSmall" style={styles.header}>Nueva Deuda</Text>

      <TextInput
        label="Título de la deuda *"
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
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <TextInput
        label="Fecha de vencimiento (Ej. 30/12/2023) *"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="dueDate-input"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="description-input"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de deuda:</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
          { value: 'Persona', label: 'Persona' },
          { value: 'Individual', label: 'Individual' },
        ]}
        style={styles.segmented}
      />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
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
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
