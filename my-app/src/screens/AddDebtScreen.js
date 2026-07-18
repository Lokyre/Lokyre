import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDebts } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';

const AddDebtScreen = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const { addDebt } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor llena todos los campos requeridos (Título, Monto, Fecha).');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número válido.');
      return;
    }

    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount).toString(),
      type,
      dueDate,
      description,
      isPaid: false,
    };

    addDebt(newDebt);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TextInput
        label="Título (Ej. Tarjeta VISA)"
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
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />
      <TextInput
        label="Fecha de Vencimiento (DD/MM/YYYY)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="input-date"
      />
      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-desc"
      />

      <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <View style={styles.radioItem}>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Crédito" testID="radio-credito" />
            <Text>Crédito</Text>
          </View>
        </View>
        <View style={styles.radioRow}>
          <View style={styles.radioItem}>
            <RadioButton value="Persona" testID="radio-persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Individual" testID="radio-individual" />
            <Text>Individual</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  radioTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
