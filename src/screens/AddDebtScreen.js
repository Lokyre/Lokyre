import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext, DEBT_TYPES } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = () => {
  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(DEBT_TYPES.TARJETAS);

  const handleSave = () => {
    if (!description || !amount) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      description,
      amount: parsedAmount,
      type,
      date: new Date().toISOString(),
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Categoría</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          {Object.values(DEBT_TYPES).map((debtType) => (
            <RadioButton.Item key={debtType} label={debtType} value={debtType} />
          ))}
        </RadioButton.Group>
      </View>

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
    marginBottom: 24,
  },
  radioTitle: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
