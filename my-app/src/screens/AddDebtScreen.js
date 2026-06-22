import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebtContext();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      alert('El título y el monto son requeridos.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjeta" />
          <Text>Tarjeta</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Crédito" />
          <Text>Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Persona" />
          <Text>Persona</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individual" />
          <Text>Individual</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-duedate"
      />
      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
});

export default AddDebtScreen;
