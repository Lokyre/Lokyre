import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      category,
      notes,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.radioGroup}>
        <Title style={styles.radioTitle}>Categoría:</Title>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Notas (Opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
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
    backgroundColor: '#fff',
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
});

export default AddDebtScreen;
