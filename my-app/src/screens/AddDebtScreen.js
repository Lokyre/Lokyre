import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const AddDebtScreen = () => {
  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos obligatorios (Título, Monto, Fecha)');
      return;
    }

    addDebt({
      title,
      amount,
      type,
      dueDate, // Consider using a date picker library in the future for better UX
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <RadioButton value="Tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Crédito" />
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Individual" />
            <Text>Individual</Text>
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="Ej: 2024-12-31"
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
      >
        Guardar Deuda
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
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
