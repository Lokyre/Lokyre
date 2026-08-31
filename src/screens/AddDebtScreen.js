import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddDebtScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const editingId = route.params?.debtId;
  const isEditing = !!editingId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate || '');
        setDescription(debtToEdit.description || '');
      }
    }
  }, [editingId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto válidos.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número mayor a cero.');
      return;
    }

    const debtData = {
      title,
      amount: numericAmount,
      type,
      dueDate,
      description,
    };

    if (isEditing) {
      updateDebt(editingId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.headerTitle}>
        {isEditing ? 'Editar Deuda' : 'Nueva Deuda'}
      </Title>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 31-12-2024)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        testID="input-date"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
        testID="input-desc"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type} testID="radio-group-type">
          {DEBT_TYPES.map(t => (
            <RadioButton.Item key={t} label={t} value={t} testID={`radio-${t}`} />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        testID="btn-save"
      >
        Guardar
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  radioContainer: {
    marginVertical: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
