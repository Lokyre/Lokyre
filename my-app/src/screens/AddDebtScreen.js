import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const { addDebt } = useContext(DebtContext);

  const handleSave = () => {
    if (!concept || !amount) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      concept,
      amount: parsedAmount,
      type,
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Concepto (Ej. Pago de luz)"
        value={concept}
        onChangeText={setConcept}
        style={styles.input}
        testID="input-concept"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
        <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
        <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    marginBottom: 40,
  },
});

export default AddDebtScreen;
