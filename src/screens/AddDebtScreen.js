import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, RadioButton, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!description || !amount) {
      if (globalThis.alert) {
         globalThis.alert('Por favor completa todos los campos.');
      }
      return;
    }

    const newDebt = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString(),
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
       <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Agregar Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          testID="input-description"
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          testID="input-amount"
        />

        <Text style={styles.label}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>

        <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
          Guardar
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
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
