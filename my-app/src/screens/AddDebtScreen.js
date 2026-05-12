import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const AddDebtScreen = () => {
  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit Card'); // 'Credit Card', 'Loan', 'Person'
  // Using a simple text input for date for simplicity, a real app might use a DatePicker component
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddDebt = () => {
    if (!title || !amount || !dueDate) {
      alert('Please fill out all fields.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Title style={styles.title}>Add New Debt</Title>

      <TextInput
        label="Title / Name"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Title style={styles.subTitle}>Debt Type</Title>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Credit Card', label: 'Credit Card' },
          { value: 'Loan', label: 'Loan' },
          { value: 'Person', label: 'Person' },
        ]}
        style={styles.input}
      />

      <TextInput
        label="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleAddDebt} style={styles.button}>
        Save Debt
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
});

export default AddDebtScreen;
