import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { addDebt, editDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const editId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editId) {
      const debtToEdit = debts.find((d) => d.id === editId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description);
      }
    }
  }, [editId, debts]);

  const handleSave = () => {
    const debtData = {
      title,
      amount: parseFloat(amount) || 0,
      type,
      dueDate,
      description,
    };

    if (editId) {
      editDebt(editId, debtData);
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
      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Individual" value="Individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
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
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioContainer: {
    marginBottom: 16,
  },
});

export default AddEditDebtScreen;
