import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('persona'); // 'tarjeta', 'credito', 'persona', 'otro'
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name || !amount) {
      alert('Por favor, ingresa el nombre y el monto.');
      return;
    }

    const newDebt = {
      name,
      amount: parseFloat(amount),
      type,
      description,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre / Entidad"
        value={name}
        onChangeText={setName}
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Persona" value="persona" />
        <RadioButton.Item label="Tarjeta de Crédito" value="tarjeta" />
        <RadioButton.Item label="Crédito" value="credito" />
        <RadioButton.Item label="Otro" value="otro" />
      </RadioButton.Group>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
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
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    marginBottom: 40,
  },
});
