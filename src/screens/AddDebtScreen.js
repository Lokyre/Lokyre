import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!title || !amount) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor completa todos los campos obligatorios');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      }
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      if (Platform.OS === 'web') {
        globalThis.alert('El monto debe ser un número válido mayor a 0');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      }
      return;
    }

    addDebt(title, amount, type);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="debt-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="debt-amount"
      />
      <View style={styles.radioGroup}>
        <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>
      </View>
      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
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
  radioGroup: {
    marginBottom: 16,
  },
  radioTitle: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
