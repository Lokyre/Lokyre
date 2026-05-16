import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('card');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      category,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
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
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioTitle}>Categoría:</Text>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          <RadioButton.Item label="Tarjetas" value="card" />
          <RadioButton.Item label="Créditos" value="loan" />
          <RadioButton.Item label="Personas" value="person" />
          <RadioButton.Item label="Individual" value="individual" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
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
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
