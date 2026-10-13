import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const AddDebtScreen = () => {
  const { addDebt } = useDebts();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!title.trim() || !amount.trim() || isNaN(amount)) {
      if (globalThis.alert) {
         globalThis.alert('Error: Por favor, ingrese un título y un monto válido.');
      }
      return;
    }

    addDebt(title, amount, type);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nueva Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Título (Ej. Tarjeta Visa, Préstamo coche)"
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
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Deuda
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
});

export default AddDebtScreen;
