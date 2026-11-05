import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ route, navigation }) {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [notes, setNotes] = useState('');

  const editingId = route.params?.id;

  useEffect(() => {
    if (editingId) {
      const debtToEdit = debts.find((d) => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setCategory(debtToEdit.category);
        setNotes(debtToEdit.notes || '');
      }
    }
  }, [editingId, debts]);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      showAlert('Error', 'Por favor ingresa un título y un monto válido.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      showAlert('Error', 'El monto debe ser un número mayor a cero.');
      return;
    }

    const debtData = {
      id: editingId || uuidv4(),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      notes: notes.trim(),
      date: new Date().toISOString(),
    };

    if (editingId) {
      updateDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título (Ej. Tarjeta Visa)"
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

        <Text style={styles.label}>Categoría:</Text>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>

        <TextInput
          label="Notas Adicionales"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          {editingId ? 'Actualizar Deuda' : 'Guardar Deuda'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
