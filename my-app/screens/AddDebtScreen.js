import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Personal'); // Personal, Tarjeta, Crédito
  const [date, setDate] = useState('');

  const saveDebt = async () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Por favor ingresa nombre y cantidad.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      name,
      amount: parseFloat(amount).toString(),
      type,
      date: date || new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    try {
      const jsonValue = await AsyncStorage.getItem('@debts');
      const storedDebts = jsonValue != null ? JSON.parse(jsonValue) : [];
      storedDebts.push(newDebt);
      await AsyncStorage.setItem('@debts', JSON.stringify(storedDebts));
      navigation.goBack();
    } catch (e) {
      console.error('Error saving debt', e);
      Alert.alert('Error', 'No se pudo guardar la deuda.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre / Entidad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez, Tarjeta Visa"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cantidad ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Deuda</Text>
        <View style={styles.typeContainer}>
          {['Personal', 'Tarjeta', 'Crédito'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonSelected]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextSelected]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fecha Límite (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveDebt}>
        <Text style={styles.saveButtonText}>Guardar Deuda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeText: {
    color: '#666',
  },
  typeTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
