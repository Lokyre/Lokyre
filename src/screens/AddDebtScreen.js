import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!name.trim()) {
      if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor ingresa el nombre de la deuda.');
      } else {
        Alert.alert('Error', 'Por favor ingresa el nombre de la deuda.');
      }
      return;
    }

    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor ingresa un monto válido mayor a 0.');
      } else {
        Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0.');
      }
      return;
    }

    addDebt(name, amount, type);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre de la deuda"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        testID="name-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="amount-input"
      />

      <View style={styles.radioContainer}>
        <Title style={styles.radioTitle}>Tipo de Deuda</Title>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
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
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
});

export default AddDebtScreen;
