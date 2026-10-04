import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');

  const handleSave = () => {
    if (!description || !amount) {
      alert('Por favor, ingresa una descripción y un monto.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    addDebt({
      description,
      amount: parseFloat(amount),
      type,
    });

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
        left={<TextInput.Affix text="$" />}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tipo de Deuda
      </Text>

      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" />
        <RadioButton.Item label="Personas" value="Personas" />
        <RadioButton.Item label="Individuales" value="Individuales" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={theme.colors.primary}
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
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
