import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    const newDebt = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo Juan)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <TextInput
        label="Fecha de Vencimiento (Opcional, ej. 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="input-date"
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tipo de Deuda:
      </Text>

      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow} testID="radio-tarjeta-container">
          <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          <Text>Tarjeta de Crédito</Text>
        </View>
        <View style={styles.radioRow} testID="radio-credito-container">
          <RadioButton value="Crédito" testID="radio-credito" />
          <Text>Crédito/Préstamo</Text>
        </View>
        <View style={styles.radioRow} testID="radio-persona-container">
          <RadioButton value="Persona" testID="radio-persona" />
          <Text>Persona (Amigo/Familiar)</Text>
        </View>
        <View style={styles.radioRow} testID="radio-otro-container">
          <RadioButton value="Otro" testID="radio-otro" />
          <Text>Otro</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save-debt"
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
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});
