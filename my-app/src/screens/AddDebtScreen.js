import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation, route }) => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const editingId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingId) {
      const debtToEdit = debts.find((d) => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [editingId, debts]);

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor, ingrese un título y un monto válido.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      description,
      isPaid: false,
    };

    if (editingId) {
      await updateDebt(editingId, debtData);
    } else {
      await addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título de la Deuda</Text>
      <TextInput
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        placeholder="Ej. Tarjeta Visa, Préstamo de Juan"
        style={styles.input}
        testID="input-title"
      />

      <Text style={styles.label}>Monto</Text>
      <TextInput
        mode="outlined"
        value={amount}
        onChangeText={setAmount}
        placeholder="Ej. 150.50"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Tipo de Deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
          { value: 'Persona', label: 'Persona' },
          { value: 'Individual', label: 'Individual' },
        ]}
        style={styles.segmentedButtons}
      />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        placeholder="Detalles adicionales..."
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        {editingId ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
