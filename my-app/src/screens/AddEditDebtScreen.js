import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddEditDebtScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      const debtToEdit = debts.find(d => d.id === id);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description);
      }
    }
  }, [id, debts]);

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Título, Monto, Fecha)');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (id) {
      await updateDebt(id, debtData);
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

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-date"
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium">Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioItem}>
             <RadioButton value="Tarjeta" testID="radio-tarjeta"/>
             <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
             <RadioButton value="Crédito" testID="radio-credito"/>
             <Text>Crédito</Text>
          </View>
          <View style={styles.radioItem}>
             <RadioButton value="Persona" testID="radio-persona"/>
             <Text>Persona</Text>
          </View>
          <View style={styles.radioItem}>
             <RadioButton value="Individual" testID="radio-individual"/>
             <Text>Individual</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
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
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
