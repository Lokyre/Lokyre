import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!description || !amount || !dueDate) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      setError('El monto debe ser un número válido.');
      return;
    }

    const newDebt = {
      description,
      amount: parseFloat(amount),
      dueDate,
      type,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tipo de Deuda</Text>
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

      <TextInput
        label="Descripción o Nombre"
        value={description}
        onChangeText={setDescription}
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
        left={<TextInput.Affix text="$ " />}
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
      />

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  segmented: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
