import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, updateDebt } = useDebts();
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios (Título, Monto, Fecha de Vencimiento).');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0.');
      return;
    }

    const debtData = {
      title,
      amount: parsedAmount,
      type,
      dueDate,
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
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />

      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={(newValue) => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
           <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta"/>
        </View>
        <View style={styles.radioRow}>
           <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito"/>
        </View>
        <View style={styles.radioRow}>
            <RadioButton.Item label="Persona" value="Persona" testID="radio-persona"/>
        </View>
         <View style={styles.radioRow}>
            <RadioButton.Item label="Individual" value="Individual" testID="radio-individual"/>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
