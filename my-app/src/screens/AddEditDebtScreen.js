import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const editingDebt = route.params?.debt;

  const [title, setTitle] = useState(editingDebt ? editingDebt.title : '');
  const [amount, setAmount] = useState(editingDebt ? editingDebt.amount.toString() : '');
  const [type, setType] = useState(editingDebt ? editingDebt.type : 'Credit Card');
  const [dueDate, setDueDate] = useState(editingDebt ? editingDebt.dueDate : '');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Title and Amount are required.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      isPaid: editingDebt ? editingDebt.isPaid : false,
    };

    if (editingDebt) {
      updateDebt({ ...debtData, id: editingDebt.id });
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={editingDebt ? "Edit Debt" : "Add Debt"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Title"
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

        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            { value: 'Credit Card', label: 'Card' },
            { value: 'Loan', label: 'Loan' },
            { value: 'Person', label: 'Person' },
            { value: 'Individual', label: 'Indiv' },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Due Date (e.g., YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  }
});

export default AddEditDebtScreen;
