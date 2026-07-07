import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Título, Monto, Vencimiento).');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nueva Deuda" />
      </Appbar.Header>

      <ScrollView style={styles.form}>
        <TextInput
          label="Título de la deuda *"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          testID="input-title"
        />

        <TextInput
          label="Monto *"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          testID="input-amount"
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
          <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
            <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
            <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
            <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
            <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
          </RadioButton.Group>
        </View>

        <TextInput
          label="Fecha de Vencimiento (ej. 2023-12-31) *"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          testID="input-date"
        />

        <TextInput
          label="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
          testID="input-desc"
        />

        <Button mode="contained" onPress={handleAdd} style={styles.button} testID="btn-submit">
          Guardar Deuda
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: { marginBottom: 15, backgroundColor: 'transparent' },
  radioGroup: { marginBottom: 15 },
  radioLabel: { fontSize: 16, marginBottom: 5, color: '#333' },
  button: { marginTop: 10, paddingVertical: 5, marginBottom: 40 },
});
