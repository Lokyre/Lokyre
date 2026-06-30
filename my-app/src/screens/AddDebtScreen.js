import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa el título, monto y fecha de vencimiento.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser numérico.');
      return;
    }

    addDebt({
      title,
      amount,
      type,
      dueDate,
      description
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="input-amount"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 15/10/2023)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="input-date"
      />

      <View style={styles.radioGroupContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}><RadioButton value="Tarjeta" /><Text>Tarjeta</Text></View>
            <View style={styles.radioItem}><RadioButton value="Crédito" /><Text>Crédito</Text></View>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}><RadioButton value="Persona" /><Text>Persona</Text></View>
            <View style={styles.radioItem}><RadioButton value="Individual" /><Text>Individual</Text></View>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  radioGroupContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  radioTitle: {
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  }
});
