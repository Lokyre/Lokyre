import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts, DebtCategories } from '../context/DebtContext';

const AddDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt } = useDebts();
  const editingDebt = route.params?.debt;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DebtCategories.TARJETAS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingDebt) {
      setName(editingDebt.name);
      setAmount(String(editingDebt.amount));
      setCategory(editingDebt.category);
      setDate(editingDebt.date);
    }
  }, [editingDebt]);

  const handleSave = () => {
    if (!name || !amount) {
      if (Platform.OS === 'web') {
        window.alert('Por favor completa todos los campos requeridos');
      } else {
        alert('Por favor completa todos los campos requeridos');
      }
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      category,
      date,
    };

    if (editingDebt) {
      updateDebt(editingDebt.id, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre / Descripción"
        value={name}
        onChangeText={setName}
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
        left={<TextInput.Affix text="$" />}
      />

      <TextInput
        label="Fecha (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {Object.values(DebtCategories).map((cat) => (
          <RadioButton.Item key={cat} label={cat} value={cat} />
        ))}
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        {editingDebt ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    padding: 8,
  },
});

export default AddDebtScreen;
