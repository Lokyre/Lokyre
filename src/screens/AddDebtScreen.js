import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    await addDebt({
      title,
      amount,
      type,
      dueDate,
      notes,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Alquiler, Juan)"
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

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Individual" value="Individual" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Persona" value="Persona" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Notas (Opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline={true}
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-debt-button">
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
  radioContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  button: {
    marginTop: 8,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
