import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { debts, addDebt, editDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setCategory(debt.category);
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (isEditing) {
      editDebt(debtId, title, amount, category);
    } else {
      addDebt(title, amount, category);
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
        testID="title-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
        <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
        <RadioButton.Item label="Otros" value="Otros" testID="radio-otros" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    marginTop: 30,
  }
});

export default AddEditDebtScreen;
