import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function AddDebtScreen() {
  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa al menos el título y el monto.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0.');
      return;
    }

    await addDebt({
      title,
      amount: numericAmount,
      type,
      description,
      dueDate,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium">Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioItem}>
             <Text>Tarjeta</Text>
             <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          </View>
          <View style={styles.radioItem}>
             <Text>Crédito</Text>
             <RadioButton value="Crédito" testID="radio-credito" />
          </View>
          <View style={styles.radioItem}>
             <Text>Persona</Text>
             <RadioButton value="Persona" testID="radio-persona" />
          </View>
          <View style={styles.radioItem}>
             <Text>Individual</Text>
             <RadioButton value="Individual" testID="radio-individual" />
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        placeholder="DD/MM/AAAA"
        testID="input-date"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-desc"
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button} testID="btn-submit">
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
    backgroundColor: 'transparent',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});
