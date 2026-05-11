import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddEditDebtScreen({ route, navigation }) {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const existingDebt = route.params?.debt;

  const [title, setTitle] = useState(existingDebt ? existingDebt.title : '');
  const [type, setType] = useState(existingDebt ? existingDebt.type : 'credit_card');
  const [amount, setAmount] = useState(existingDebt ? existingDebt.amount.toString() : '');
  const [dueDate, setDueDate] = useState(existingDebt ? existingDebt.dueDate : '');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    const debtData = {
      id: existingDebt ? existingDebt.id : undefined,
      title,
      type,
      amount: parseFloat(amount),
      dueDate,
    };

    if (existingDebt) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
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
      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjeta de Crédito" value="credit_card" />
          <RadioButton.Item label="Préstamo" value="loan" />
          <RadioButton.Item label="Persona" value="person" />
          <RadioButton.Item label="Individual" value="individual" />
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
