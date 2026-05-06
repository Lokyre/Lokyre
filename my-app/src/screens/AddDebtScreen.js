import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';
import { Picker } from '@react-native-picker/picker'; // We need to install this

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjeta de Crédito');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert('Error', 'El monto debe ser un número válido mayor a 0.');
        return;
    }

    const newDebt = {
      title,
      amount: parseFloat(amount),
      category,
      dueDate,
      notes,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Título / Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Visa Banco, Préstamo Juan"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Tarjeta de Crédito" value="Tarjeta de Crédito" />
            <Picker.Item label="Préstamo Personal" value="Préstamo Personal" />
            <Picker.Item label="Deuda a Persona" value="Deuda a Persona" />
            <Picker.Item label="Otro" value="Otro" />
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fecha de Vencimiento</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA o Texto libre"
          value={dueDate}
          onChangeText={setDueDate}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notas (Opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalles adicionales..."
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Deuda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
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

export default AddDebtScreen;
