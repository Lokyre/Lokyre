import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [entity, setEntity] = useState('');
  const [type, setType] = useState('personal'); // 'credit_card', 'loan', 'personal'
  const [isOwedToMe, setIsOwedToMe] = useState(false);

  const handleSave = () => {
    if (!title || !amount || !entity) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      entity,
      type,
      isOwedToMe,
      date: new Date().toISOString(),
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Entidad o Persona"
        value={entity}
        onChangeText={setEntity}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <RadioButton.Item label="Personal" value="personal" />
        <RadioButton.Item label="Tarjeta de Crédito" value="credit_card" />
        <RadioButton.Item label="Préstamo" value="loan" />
      </RadioButton.Group>

      <Text style={styles.sectionTitle}>¿Quién debe a quién?</Text>
      <RadioButton.Group
        onValueChange={value => setIsOwedToMe(value === 'true')}
        value={isOwedToMe ? 'true' : 'false'}
      >
        <RadioButton.Item label="Yo debo el dinero" value="false" />
        <RadioButton.Item label="Me deben el dinero" value="true" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor="#6200ee"
      >
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
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
