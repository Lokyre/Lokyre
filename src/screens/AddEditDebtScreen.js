import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas de crédito');
  const [dueDate, setDueDate] = useState('');

  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const debtId = route.params?.debtId;

  useEffect(() => {
    if (debtId) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setDescription(debtToEdit.description);
        setAmount(debtToEdit.amount.toString());
        setCategory(debtToEdit.category);
        setDueDate(debtToEdit.dueDate);
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!description || !amount) {
      alert('Por favor, completa la descripción y el monto.');
      return;
    }

    const debtData = {
      description,
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
        label="Descripción (Ej. Tarjeta Visa, Préstamo Juan)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        testID="input-description"
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
        label="Fecha de Vencimiento (DD/MM/AAAA)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="input-due-date"
      />

      <Text style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={value => setCategory(value)} value={category}>
        <View style={styles.radioItem}>
          <RadioButton value="Tarjetas de crédito" testID="radio-tarjetas" />
          <Text>Tarjetas de crédito</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="Créditos/Préstamos" testID="radio-creditos" />
          <Text>Créditos / Préstamos</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="Personas" testID="radio-personas" />
          <Text>Personas</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="Individuales/Otros" testID="radio-otros" />
          <Text>Individuales / Otros</Text>
        </View>
      </RadioButton.Group>

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
    marginTop: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
