import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useDebts();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      setError('Título, monto y fecha de vencimiento son obligatorios.');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('El monto debe ser un número válido mayor a 0.');
      return;
    }

    addDebt({
      title,
      amount: Number(amount),
      type,
      dueDate,
      description
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
             <RadioButton value="Tarjeta" testID="radio-tarjeta"/>
             <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Crédito" testID="radio-credito"/>
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Persona" testID="radio-persona"/>
            <Text>Persona</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Individual" testID="radio-individual"/>
            <Text>Individual</Text>
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-duedate"
      />
      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});
