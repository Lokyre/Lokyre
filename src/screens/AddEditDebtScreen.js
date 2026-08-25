import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, editDebt, debts } = useDebts();
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('tarjeta'); // tarjeta, credito, persona, individual
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
        setDueDate(debtToEdit.dueDate || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa el título y el monto.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0.');
      return;
    }

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      description: description.trim(),
      dueDate: dueDate.trim(),
    };

    if (isEditing) {
      editDebt({ ...debtData, id: debtId, status: debts.find((d) => d.id === debtId).status });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título de la deuda *"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="title-input"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="tarjeta" testID="radio-tarjeta" />
              <Text>Tarjeta</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="credito" testID="radio-credito" />
              <Text>Crédito</Text>
            </View>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="persona" testID="radio-persona" />
              <Text>Persona</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="individual" testID="radio-individual" />
              <Text>Individual</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de Vencimiento (opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        placeholder="DD/MM/AAAA"
        style={styles.input}
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.saveButton} testID="save-button">
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
