import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, RadioButton, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = () => {
  const navigation = useNavigation();
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('persona'); // 'persona', 'tarjeta', 'credito'
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa título y monto');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número positivo');
      return;
    }

    await addDebt({
      title,
      amount: Number(amount),
      type,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Nueva Deuda</Title>

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

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-description"
      />

      <Title style={styles.subtitle}>Tipo de Deuda</Title>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="persona" />
          <Text>Persona</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="tarjeta" />
          <Text>Tarjeta de Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="credito" />
          <Text>Crédito / Préstamo</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default AddDebtScreen;
