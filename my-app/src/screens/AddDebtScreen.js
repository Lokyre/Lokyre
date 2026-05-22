import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('individual');

  const handleAdd = () => {
    if (!title || !amount) {
      alert('Por favor, completa el título y el monto.');
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('El monto debe ser un número válido mayor a 0.');
      return;
    }

    addDebt(title, amount, type);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Alquiler, Juan, Tarjeta Visa)"
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="individual" />
          <Text>Individual</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="tarjeta" />
          <Text>Tarjeta de Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="credito" />
          <Text>Crédito / Préstamo</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="persona" />
          <Text>Persona</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleAdd}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
});
