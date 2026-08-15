import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');

  const handleAdd = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor, ingresa un monto válido mayor a 0.');
      return;
    }

    addDebt({
      description: description.trim(),
      amount: parseFloat(amount).toFixed(2),
      type,
    });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        testID="description-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <View style={styles.radioGroup}>
        <Text variant="titleMedium" style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioItem}>
            <Text>Individual</Text>
            <RadioButton value="Individual" testID="radio-individual" />
          </View>
          <View style={styles.radioItem}>
            <Text>Tarjeta</Text>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          </View>
          <View style={styles.radioItem}>
            <Text>Crédito</Text>
            <RadioButton value="Crédito" testID="radio-credito" />
          </View>
          <View style={styles.radioItem}>
            <Text>Persona</Text>
            <RadioButton value="Persona" testID="radio-persona" />
          </View>
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.button}
        testID="submit-button"
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioLabel: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
});

export default AddDebtScreen;
