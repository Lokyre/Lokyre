import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit Card');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Please fill in title and amount.');
      return;
    }

    const newDebt = {
      title,
      amount: parseFloat(amount),
      type,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Title/Description"
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
      />

      <Text style={styles.radioTitle}>Debt Type:</Text>
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
          <RadioButton value="Individual" />
          <Text>Individual</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Debt
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
  radioTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 5,
  },
});

export default AddDebtScreen;
