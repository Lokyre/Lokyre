import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebtContext();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      const msg = 'Por favor, completa el título y el monto.';
      if (Platform.OS === 'web') {
        globalThis.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
      const msg = 'El monto debe ser un número válido.';
      if (Platform.OS === 'web') {
         globalThis.alert(msg);
      } else {
         Alert.alert('Error', msg);
      }
      return;
    }

    addDebt({
      title,
      amount,
      type,
      description
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Título (Ej. Tarjeta Visa, Préstamo Juan)"
          value={title}
          onChangeText={setTitle}
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

        <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioContainer}>
            <RadioButton.Item label="Tarjetas" value="Tarjetas" />
            <RadioButton.Item label="Créditos" value="Créditos" />
            <RadioButton.Item label="Personas" value="Personas" />
            <RadioButton.Item label="Individuales" value="Individuales" />
          </View>
        </RadioButton.Group>

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          Guardar Deuda
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  radioContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
