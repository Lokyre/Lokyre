import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function AddEditDebtScreen({ navigation, route }) {
  const { debtId } = route?.params || {};
  const { debts, addDebt, updateDebt } = useDebtContext();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Tarjeta');

  useEffect(() => {
    if (debtId) {
      const debt = debts.find(d => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setDescription(debt.description);
        setType(debt.type);
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      description: description.trim(),
      type,
    };

    if (debtId) {
      updateDebt({ ...debtData, id: debtId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />
      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
        <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
        Guardar
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
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});
