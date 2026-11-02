import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddEditDebtScreen({ route, navigation }) {
  const { debt } = route.params || {};
  const { addDebt, updateDebt } = useDebts();

  const [title, setTitle] = useState(debt ? debt.title : '');
  const [amount, setAmount] = useState(debt ? debt.amount : '');
  const [category, setCategory] = useState(debt ? debt.category : 'Tarjetas');
  const [description, setDescription] = useState(debt ? debt.description : '');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor ingrese el título y el monto.');
      return;
    }

    const debtData = {
      id: debt ? debt.id : undefined,
      title,
      amount,
      category,
      description,
    };

    if (debt) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título / Nombre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="debt-title-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="debt-amount-input"
      />

      <Text style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" />
        <RadioButton.Item label="Personas" value="Personas" />
        <RadioButton.Item label="Individuales" value="Individuales" />
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="debt-description-input"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-debt-button">
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});
