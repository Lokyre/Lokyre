import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { Platform } from 'react-native';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddDebtScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const handleSave = () => {
    if (!name.trim() || !amount.trim()) {
      if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor completa el nombre y el monto.');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'Por favor completa el nombre y el monto.');
      }
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
       if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor ingresa un monto válido.');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Error', 'Por favor ingresa un monto válido.');
      }
      return;
    }

    addDebt(name.trim(), parsedAmount, type);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        testID="input-name"
        label="Nombre de la deuda"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        testID="input-amount"
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Tipo de deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          {DEBT_TYPES.map((debtType) => (
            <RadioButton.Item
              key={debtType}
              label={debtType}
              value={debtType}
              testID={`radio-${debtType}`}
            />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        testID="btn-save"
        mode="contained"
        onPress={handleSave}
        style={styles.button}
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginVertical: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  radioTitle: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
