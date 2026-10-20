import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, RadioButton, Title, HelperText } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor ingresa un monto válido mayor a 0');
      }
      return;
    }

    if (!description.trim()) {
      setError('Por favor ingresa una descripción');
      if (Platform.OS === 'web') {
        globalThis.alert('Error: Por favor ingresa una descripción');
      }
      return;
    }

    addDebt({
      amount: parseFloat(amount),
      description: description.trim(),
      type
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Nueva Deuda</Title>

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setError('');
        }}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Affix text="$" />}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setError('');
        }}
        mode="outlined"
        multiline={true}
        numberOfLines={3}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        {DEBT_TYPES.map(debtType => (
          <RadioButton.Item key={debtType} label={debtType} value={debtType} />
        ))}
      </RadioButton.Group>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

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
  title: {
    marginBottom: 16,
    textAlign: 'center',
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
