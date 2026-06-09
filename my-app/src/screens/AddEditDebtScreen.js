import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const debt = route.params?.debt;

  const [title, setTitle] = useState(debt ? debt.title : '');
  const [amount, setAmount] = useState(debt ? debt.amount.toString() : '');
  const [type, setType] = useState(debt ? debt.type : 'Tarjeta');
  const [dueDate, setDueDate] = useState(debt ? debt.dueDate : '');
  const [description, setDescription] = useState(debt ? debt.description : '');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos requeridos (Título, Monto, Fecha).');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (debt) {
      updateDebt(debt.id, debtData);
    } else {
      addDebt(debtData);
    }

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
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" />
        <RadioButton.Item label="Persona" value="Persona" />
        <RadioButton.Item label="Individual" value="Individual" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

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
        Guardar
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
