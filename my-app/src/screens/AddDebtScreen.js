import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [name, setName] = useState('');
  const [type, setType] = useState('tarjeta');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddDebt = () => {
    if (!name || !totalAmount || !dueDate) {
      alert('Por favor complete todos los campos');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      name,
      type,
      totalAmount: parseFloat(totalAmount),
      remainingAmount: parseFloat(totalAmount),
      dueDate,
      payments: []
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre de la Deuda"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'tarjeta', label: 'Tarjeta' },
          { value: 'credito', label: 'Crédito' },
          { value: 'persona', label: 'Persona' },
          { value: 'individual', label: 'Individual' },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Monto Total"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha de Vencimiento (Ej: 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleAddDebt} style={styles.button}>
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
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
