import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor complete los campos obligatorios: Título, Monto y Fecha.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount,
      type,
      dueDate,
      description,
      isPaid: false
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput label="Título" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput label="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
      <TextInput label="Fecha de Vencimiento (ej. YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} style={styles.input} />
      <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline numberOfLines={3} style={styles.input} />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
        </View>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Individual" value="Individual" />
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { marginBottom: 15 },
  label: { marginTop: 10, marginBottom: 5 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { marginTop: 20, marginBottom: 40 }
});

export default AddDebtScreen;
