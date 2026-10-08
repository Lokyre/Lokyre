import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      const msg = 'Por favor ingresa un título y un monto.';
      if (typeof globalThis.alert === 'function') {
        globalThis.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      const msg = 'El monto debe ser un número válido mayor a 0.';
      if (typeof globalThis.alert === 'function') {
        globalThis.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    addDebt({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      description: description.trim(),
    });

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
          label="Título (ej. Pago de internet)"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Monto ($)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.label}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
          Guardar
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
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
