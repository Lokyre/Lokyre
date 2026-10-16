import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation, route }) {
  const { debts, addDebt, updateDebt } = useDebts();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setName(debt.name);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!name || !amount) {
      if (typeof globalThis.alert === 'function') {
         globalThis.alert('Por favor, ingresa el nombre y el monto.');
      } else {
         alert('Por favor, ingresa el nombre y el monto.');
      }
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      type,
      dueDate,
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre / Descripción"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        placeholder="ej. 15 de Octubre"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.label}>
        Tipo de Deuda:
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
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
