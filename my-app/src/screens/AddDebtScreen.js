import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit Card');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');

  const handleAddDebt = () => {
    if (!title.trim() || !amount.trim()) {
      setError('Title and Amount are required.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>New Debt</Title>

      <TextInput
        label="Title (e.g., Visa Card, John Doe)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        left={<TextInput.Affix text="$" />}
      />

      <Text style={styles.label}>Debt Type</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="Credit Card" />
          <Text>Credit Card</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Loan" />
          <Text>Loan</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Person" />
          <Text>Person</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Other" />
          <Text>Other</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button mode="contained" onPress={handleAddDebt} style={styles.button}>
        Add Debt
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
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddDebtScreen;
