import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { saveDebt, getDebtById, updateDebt } from '../services/storage';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

export default function AddEditDebtScreen({ route, navigation }) {
  const { debtId } = route?.params || {};

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debtId) {
      loadDebtData();
    }
  }, [debtId]);

  const loadDebtData = async () => {
    const debt = await getDebtById(debtId);
    if (debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
      setCategory(debt.category);
      setDescription(debt.description || '');
    }
  };

  const handleSave = async () => {
    if (!name || !amount) {
      alert('Por favor completa el nombre y el monto.');
      return;
    }

    setLoading(true);
    const debtData = {
      name,
      amount: parseFloat(amount),
      category,
      description,
    };

    try {
      if (debtId) {
        await updateDebt(debtId, debtData);
      } else {
        await saveDebt(debtData);
      }
      navigation.goBack();
    } catch (e) {
      alert('Hubo un error al guardar la deuda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {debtId ? 'Editar Deuda' : 'Nueva Deuda'}
      </Text>

      <TextInput
        label="Nombre de la deuda"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        testID="name-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {CATEGORIES.map(cat => (
          <RadioButton.Item key={cat} label={cat} value={cat} testID={`category-${cat}`} />
        ))}
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline={true}
        numberOfLines={3}
        style={styles.input}
        testID="description-input"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="save-button"
      >
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
});
