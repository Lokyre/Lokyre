import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const { addDebt } = useDebts();
  const theme = useTheme();

  const handleSave = () => {
    if (!description || !amount) {
      if (Platform.OS === 'web') {
        globalThis.alert('Por favor ingrese descripción y monto');
      } else {
        Alert.alert('Error', 'Por favor ingrese descripción y monto');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
      if (Platform.OS === 'web') {
        globalThis.alert('El monto debe ser un número válido');
      } else {
        Alert.alert('Error', 'El monto debe ser un número válido');
      }
      return;
    }

    addDebt(description, amount, category);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
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
        left={<TextInput.Affix text="$" />}
      />

      <Text style={styles.sectionTitle}>Categoría</Text>

      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" />
        <RadioButton.Item label="Personas" value="Personas" />
        <RadioButton.Item label="Individuales" value="Individuales" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor="#1976d2"
      >
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
