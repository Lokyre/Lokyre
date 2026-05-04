import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';
import { Picker } from '@react-native-picker/picker'; // We need to install this

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState(''); // Simple string for now for simplicity

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto válido.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número positivo.');
      return;
    }

    addDebt({
      title: title.trim(),
      amount: numericAmount,
      category,
      dueDate: dueDate.trim(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título de la Deuda</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Tarjeta de Crédito, Juan..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 1500.50"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tarjetas" value="Tarjetas" />
          <Picker.Item label="Créditos" value="Créditos" />
          <Picker.Item label="Personas" value="Personas" />
          <Picker.Item label="Individuales" value="Individuales" />
        </Picker>
      </View>

      <Text style={styles.label}>Fecha de Vencimiento (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA o descripción"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Deuda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50, // For scrollview padding
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
