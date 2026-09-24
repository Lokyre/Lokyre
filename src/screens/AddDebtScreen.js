import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts, DEBT_TYPES } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddDebtScreen() {
  const { addDebt, updateDebt, debts } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(DEBT_TYPES.TARJETAS);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      if (globalThis.alert) {
        globalThis.alert('Por favor completa el título y el monto.');
      }
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      description,
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
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

      <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Tarjetas" value={DEBT_TYPES.TARJETAS} />
        <RadioButton.Item label="Créditos" value={DEBT_TYPES.CREDITOS} />
        <RadioButton.Item label="Personas" value={DEBT_TYPES.PERSONAS} />
        <RadioButton.Item label="Individuales" value={DEBT_TYPES.INDIVIDUALES} />
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="save-debt-button"
      >
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 6,
  },
});
