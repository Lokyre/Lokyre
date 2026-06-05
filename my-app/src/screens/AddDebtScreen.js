import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      setError('Por favor, completa los campos obligatorios: Título, Monto y Fecha.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      setError('El monto debe ser un número válido.');
      return;
    }

    const newDebt = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Detalles de la Deuda</Title>

      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 2023-12-31) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
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

      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
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
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar Deuda
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
  },
  input: {
    marginBottom: 12,
  },
  radioGroup: {
    marginVertical: 12,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default AddDebtScreen;
