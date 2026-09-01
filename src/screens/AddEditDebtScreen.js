import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

export default function AddEditDebtScreen() {
  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Persona');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDescription(debt.description);
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    const debtData = {
      id: isEditing ? debtId : uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      description,
      date: new Date().toLocaleDateString(),
      isPaid: isEditing ? debts.find(d => d.id === debtId).isPaid : false,
    };

    if (isEditing) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Alquiler, Juan, Tarjeta Visa)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tipo de Deuda
      </Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Persona" value="Persona" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Otro" value="Otro" />
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 5,
  },
});