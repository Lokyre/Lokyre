import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const { addDebt } = useDebts();
  const theme = useTheme();

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor complete todos los campos.');
      } else {
        alert('Por favor complete todos los campos.');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
       if (Platform.OS === 'web') {
        globalThis.alert('El monto debe ser un número válido.');
      } else {
        alert('El monto debe ser un número válido.');
      }
      return;
    }

    addDebt({
      description,
      amount: parseFloat(amount),
      category,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Registrar Nueva Deuda</Title>

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioTitle}>Categoría:</Text>
        <RadioButton.Group onValueChange={value => setCategory(value)} value={category}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  radioContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

export default AddDebtScreen;
