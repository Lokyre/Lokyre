import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!description || !amount || isNaN(amount)) {
      if(globalThis.alert) {
          globalThis.alert('Por favor, ingresa una descripción y un monto válido.');
      }
      return;
    }

    addDebt(description, amount, type);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioTitle}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

      <Button
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
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginVertical: 16,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
