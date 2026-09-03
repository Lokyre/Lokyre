import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const debtId = route?.params?.debtId;
  const existingDebt = debts.find((d) => d.id === debtId);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('persona'); // 'persona', 'tarjeta', 'credito'
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (existingDebt) {
      setName(existingDebt.name);
      setAmount(existingDebt.amount.toString());
      setCategory(existingDebt.category || 'persona');
      setDueDate(existingDebt.dueDate || '');
    }
  }, [existingDebt]);

  const handleSave = () => {
    if (!name || !amount) {
      alert('Por favor, ingresa nombre y monto.');
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      category,
      dueDate,
    };

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
        label="Nombre / Entidad"
        value={name}
        onChangeText={setName}
        style={styles.input}
        testID="input-name"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <RadioButton.Item label="Persona" value="persona" />
        <RadioButton.Item label="Tarjeta de Crédito" value="tarjeta" />
        <RadioButton.Item label="Crédito/Préstamo" value="credito" />
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        placeholder="DD/MM/AAAA"
        testID="input-date"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
