import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim() || isNaN(amount)) {
      alert('Please enter a valid title and amount.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title: title.trim(),
      amount: parseFloat(amount).toFixed(2),
      type,
      description: description.trim(),
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Debt Type:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioOption}>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Crédito" testID="radio-credito" />
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Persona" testID="radio-persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Individual" testID="radio-individual" />
            <Text>Individual</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
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
  input: {
    marginBottom: 15,
  },
  radioContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  radioTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

export default AddDebtScreen;
