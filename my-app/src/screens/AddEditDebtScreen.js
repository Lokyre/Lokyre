import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
        setDescription(debt.description);
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios (Título, Monto, Fecha de Vencimiento).');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (isEditing) {
      await updateDebt(debtId, debtData);
    } else {
      await addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  radioContainer: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
