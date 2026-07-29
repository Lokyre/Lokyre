import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddEditDebtScreen() {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { debtId } = route.params || {};

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (debtId) {
      const debt = debts.find(d => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
        setDescription(debt.description || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title || !amount) return;

    const debtData = { title, amount: parseFloat(amount), type, dueDate, description };

    if (debtId) {
      updateDebt(debtId, debtData);
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  }
});
