import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const debtToEdit = route.params?.debt;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (debtToEdit) {
      setName(debtToEdit.name);
      setAmount(debtToEdit.amount.toString());
      setCategory(debtToEdit.category);
      setDueDate(debtToEdit.dueDate || '');
    }
  }, [debtToEdit]);

  const handleSave = () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre y un monto válidos.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número.');
      return;
    }

    const debtData = {
      ...debtToEdit,
      name,
      amount: parseFloat(amount),
      category,
      dueDate,
    };

    if (debtToEdit) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre de la Deuda"
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
      <TextInput
        label="Fecha de Vencimiento (Opcional, Ej. 2023-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-due-date"
      />

      <Title style={styles.radioTitle}>Categoría</Title>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjetas" testID="radio-tarjetas" />
          <Text>Tarjetas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Créditos" testID="radio-creditos" />
          <Text>Créditos</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Personas" testID="radio-personas" />
          <Text>Personas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individuales" testID="radio-individuales" />
          <Text>Individuales</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 15,
  },
  radioTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 5,
  },
});

export default AddEditDebtScreen;
