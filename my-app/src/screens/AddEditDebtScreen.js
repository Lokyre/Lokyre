import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { debtId } = route.params || {};
  const { debts, addDebt, updateDebt } = useDebtContext();
  const existingDebt = debts.find((d) => d.id === debtId);

  const [title, setTitle] = useState(existingDebt ? existingDebt.title : '');
  const [amount, setAmount] = useState(existingDebt ? existingDebt.amount.toString() : '');
  const [type, setType] = useState(existingDebt ? existingDebt.type : 'Tarjeta');
  const [dueDate, setDueDate] = useState(existingDebt ? existingDebt.dueDate : '');
  const [description, setDescription] = useState(existingDebt ? existingDebt.description : '');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Please fill out the title and amount');
      return;
    }

    const debtData = {
      id: existingDebt ? existingDebt.id : uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
      isPaid: existingDebt ? existingDebt.isPaid : false,
    };

    if (existingDebt) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="title-input"
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />
      <TextInput
        label="Due Date (e.g. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="duedate-input"
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="description-input"
      />

      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Debt Type:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioItem}>
            <RadioButton value="Tarjeta" testID="type-tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Crédito" testID="type-credito" />
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Persona" testID="type-persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Individual" testID="type-individual" />
            <Text>Individual</Text>
          </View>
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Save
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
  },
  radioGroup: {
    marginVertical: 12,
  },
  radioLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
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

export default AddEditDebtScreen;
