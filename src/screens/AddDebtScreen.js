import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import { addDebt } from '../utils/storage';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

export default function AddDebtScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!amount.trim()) {
      newErrors.amount = 'El monto es requerido';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        await addDebt({
          description: description.trim(),
          amount: parseFloat(amount).toString(),
          type,
        });
        navigation.goBack();
      } catch (error) {
        console.error('Error saving debt:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción de la deuda"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        error={!!errors.description}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.amount}
      />
      <HelperText type="error" visible={!!errors.amount}>
        {errors.amount}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Deuda</Text>

      <View style={styles.radioGroup}>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          {DEBT_TYPES.map((t) => (
            <RadioButton.Item key={t} label={t} value={t} testID={`radio-${t}`} />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="save-button"
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  radioGroup: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 6,
  }
});
