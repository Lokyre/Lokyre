import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor llena los campos obligatorios (Título, Monto, Fecha de Vencimiento)');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount,
      type,
      dueDate,
      description,
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />
      <TextInput
        label="Fecha de Vencimiento (ej. DD/MM/AAAA) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-date"
      />

      <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
        </View>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Individual" value="Individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        testID="input-desc"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 12 },
  radioTitle: { marginTop: 12, marginBottom: 8, paddingHorizontal: 8 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { marginTop: 20, marginBottom: 40 },
});

export default AddDebtScreen;
