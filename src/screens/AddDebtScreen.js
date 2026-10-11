import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const { addDebt } = useDebts();
  const theme = useTheme();

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      // In a real app we'd show a proper error dialog, using alert for simplicity in React Native
      if (Platform.OS === 'web') {
          globalThis.alert('Error: Por favor completa todos los campos.');
      } else {
          require('react-native').Alert.alert('Error', 'Por favor completa todos los campos.');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
      if (Platform.OS === 'web') {
          globalThis.alert('Error: El monto debe ser un número válido.');
      } else {
          require('react-native').Alert.alert('Error', 'El monto debe ser un número válido.');
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
      <View style={styles.form}>
        <TextInput
          label="Descripción (Ej. Tarjeta VISA, Préstamo Auto)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Affix text="$" />}
        />

        <Title style={styles.sectionTitle}>Categoría</Title>
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
          contentStyle={styles.buttonContent}
        >
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 8,
  }
});
