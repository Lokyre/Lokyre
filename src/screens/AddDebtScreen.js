import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      const msg = 'Por favor, ingresa la descripción y el monto.';
      if (globalThis.alert) {
         globalThis.alert(msg);
      } else {
         Alert.alert('Error', msg);
      }
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      const msg = 'Por favor, ingresa un monto válido mayor a 0.';
      if (globalThis.alert) {
         globalThis.alert(msg);
      } else {
         Alert.alert('Error', msg);
      }
      return;
    }

    const newDebt = {
      id: uuidv4(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción"
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
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

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
  radioContainer: {
    marginVertical: 16,
  },
  radioTitle: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
