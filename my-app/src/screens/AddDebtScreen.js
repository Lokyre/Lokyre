import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';
import { Picker } from '@react-native-picker/picker';

const AddDebtScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit Card');

  const { addDebt } = useContext(DebtContext);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be a valid number greater than 0');
      return;
    }

    addDebt(title, amount, type);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Owed to (Name/Institution):</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. John Doe, Visa"
      />

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="e.g. 150.00"
      />

      <Text style={styles.label}>Debt Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Credit Card" value="Credit Card" />
          <Picker.Item label="Personal Loan" value="Personal Loan" />
          <Picker.Item label="Individual" value="Individual" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Button title="Save Debt" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 24,
  },
});

export default AddDebtScreen;
