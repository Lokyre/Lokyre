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

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.headerTitle}>Nueva Deuda</Title>

      <TextInput
        label="Título (Ej. Tarjeta VISA)"
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

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Individual" value="Individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="DD/MM/AAAA"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
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
  headerTitle: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '500',
  },
  radioContainer: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
    marginBottom: 40,
  },
});

export default AddDebtScreen;
