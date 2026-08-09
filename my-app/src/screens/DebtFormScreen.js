import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtFormScreen = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const { addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const editingDebt = route.params?.debt;

  useEffect(() => {
    if (editingDebt) {
      setTitle(editingDebt.title);
      setAmount(editingDebt.amount.toString());
      setType(editingDebt.type);
    }
  }, [editingDebt]);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor completa el título y el monto.');
      return;
    }

    if (editingDebt) {
      updateDebt(editingDebt.id, title, amount, type);
    } else {
      addDebt(title, amount, type);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="debt-title-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="debt-amount-input"
      />

      <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <TouchableOpacity style={styles.radioRow} onPress={() => setType('Tarjeta')} testID="radio-row-Tarjeta">
          <RadioButton value="Tarjeta" testID="radio-Tarjeta" />
          <Text>Tarjeta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioRow} onPress={() => setType('Crédito')} testID="radio-row-Crédito">
          <RadioButton value="Crédito" testID="radio-Crédito" />
          <Text>Crédito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioRow} onPress={() => setType('Persona')} testID="radio-row-Persona">
          <RadioButton value="Persona" testID="radio-Persona" />
          <Text>Persona</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioRow} onPress={() => setType('Otro')} testID="radio-row-Otro">
          <RadioButton value="Otro" testID="radio-Otro" />
          <Text>Otro</Text>
        </TouchableOpacity>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-debt-button">
        {editingDebt ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  radioLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  }
});

export default DebtFormScreen;
