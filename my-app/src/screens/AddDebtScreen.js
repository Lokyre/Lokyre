import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos requeridos (Título, Monto, Fecha)');
      return;
    }

    await addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Agregar Nueva Deuda</Title>

      <TextInput
        label="Título de la deuda *"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioItem}><RadioButton value="Tarjeta" /><Text>Tarjeta</Text></View>
          <View style={styles.radioItem}><RadioButton value="Crédito" /><Text>Crédito</Text></View>
          <View style={styles.radioItem}><RadioButton value="Persona" /><Text>Persona</Text></View>
          <View style={styles.radioItem}><RadioButton value="Individual" /><Text>Individual</Text></View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de vencimiento (YYYY-MM-DD) *"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
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
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  radioContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  radioLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
