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
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número válido.');
      return;
    }

    setLoading(true);
    try {
      await addDebt({
        title,
        amount: parseFloat(amount),
        type,
        dueDate,
        description,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al guardar la deuda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título de la deuda *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Crédito" testID="radio-credito" />
            <Text>Crédito</Text>
          </View>
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

      <TextInput
        label="Fecha de Vencimiento (ej. 15 de cada mes)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        testID="input-duedate"
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
        testID="input-description"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="btn-save"
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
