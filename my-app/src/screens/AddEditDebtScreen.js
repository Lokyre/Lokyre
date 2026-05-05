import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { addDebt, editDebt } = useContext(DebtContext);
  const debtToEdit = route.params?.debt;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit Card');
  const [description, setDescription] = useState('');

  const types = ['Credit Card', 'Loan', 'Person', 'Individual'];

  useEffect(() => {
    if (debtToEdit) {
      setName(debtToEdit.name);
      setAmount(debtToEdit.amount.toString());
      setType(debtToEdit.type);
      setDescription(debtToEdit.description || '');
    }
  }, [debtToEdit]);

  const handleSave = () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Please fill in the required fields (Name and Amount).');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Amount must be a valid number.');
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      type,
      description,
      status: debtToEdit ? debtToEdit.status : 'pending',
    };

    if (debtToEdit) {
      editDebt(debtToEdit.id, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name / Title *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Visa Credit Card"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g. 500.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {types.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t ? styles.typeButtonActive : null]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeButtonText, type === t ? styles.typeButtonTextActive : null]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Optional details..."
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Debt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#1e88e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#1e88e5',
  },
  typeButtonText: {
    color: '#1e88e5',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#43a047',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditDebtScreen;
