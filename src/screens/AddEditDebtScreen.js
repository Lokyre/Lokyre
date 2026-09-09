import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = () => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { debtId } = route?.params || {};

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('persona'); // tarjeta, credito, persona, otro
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (debtId) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setDescription(debtToEdit.description || '');
        setType(debtToEdit.type || 'persona');
        setDueDate(debtToEdit.dueDate || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!title || !amount || isNaN(parsedAmount)) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const debtData = {
      title,
      amount: parsedAmount,
      description,
      type,
      dueDate,
      isPaid: debtId ? debts.find(d => d.id === debtId)?.isPaid : false
    };

    if (debtId) {
      updateDebt({ ...debtData, id: debtId, createdAt: debts.find(d => d.id === debtId)?.createdAt });
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
        mode="outlined"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Persona" value="persona" />
        <RadioButton.Item label="Tarjeta de Crédito" value="tarjeta" />
        <RadioButton.Item label="Crédito/Préstamo" value="credito" />
        <RadioButton.Item label="Otro" value="otro" />
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD) opcional"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="2023-12-31"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-debt-button">
        Guardar
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
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
