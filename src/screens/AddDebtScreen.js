import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

export default function AddDebtScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('tarjetas');
  const [dueDate, setDueDate] = useState('');

  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const handleAddDebt = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido.');
      return;
    }

    // Basic date format validation YYYY-MM-DD
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dueDate)) {
      Alert.alert('Error', 'El formato de fecha debe ser YYYY-MM-DD.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      totalAmount: parsedAmount,
      totalPaid: 0,
      category,
      dueDate,
      status: 'pendiente',
      payments: []
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título de la deuda"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Monto Total"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Fecha de Vencimiento (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
          placeholder="Ej: 2023-12-31"
        />

        <Title style={styles.radioTitle}>Categoría</Title>
        <RadioButton.Group onValueChange={value => setCategory(value)} value={category}>
          <View style={styles.radioItem}>
            <RadioButton value="tarjetas" />
            <Text>Tarjetas de Crédito</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="créditos" />
            <Text>Créditos Bancarios</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="personas" />
            <Text>Préstamos Personales</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="otros" />
            <Text>Otros</Text>
          </View>
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={handleAddDebt}
          style={styles.button}
        >
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  radioTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
  },
});
