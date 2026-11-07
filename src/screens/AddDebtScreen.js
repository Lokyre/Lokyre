import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Individuales');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      setError('Por favor, ingresa el título y el monto.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      setError('El monto debe ser un número válido.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      description,
      type
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="title-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="amount-input"
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={styles.input}
        mode="outlined"
        testID="description-input"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales"/>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas"/>
        <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos"/>
        <RadioButton.Item label="Personas" value="Personas" testID="radio-personas"/>
      </RadioButton.Group>

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
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
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 8
  }
});

export default AddDebtScreen;
