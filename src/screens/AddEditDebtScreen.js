import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const editingDebtId = route.params?.debtId;
  const isEditing = !!editingDebtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tarjeta');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === editingDebtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setDescription(debtToEdit.description || '');
        setCategory(debtToEdit.category || 'Tarjeta');
      }
    }
  }, [isEditing, editingDebtId, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto válido.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número mayor a 0.');
      return;
    }

    const debtData = {
      title,
      amount: parsedAmount,
      description,
      category,
    };

    if (isEditing) {
      updateDebt({ ...debtData, id: editingDebtId, date: debts.find(d => d.id === editingDebtId).date });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          <Text>Tarjeta</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Crédito" testID="radio-credito" />
          <Text>Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Persona" testID="radio-persona" />
          <Text>Persona</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Otro" testID="radio-otro" />
          <Text>Otro</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

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
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
