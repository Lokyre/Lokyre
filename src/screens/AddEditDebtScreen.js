import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DEBT_TYPES = [
  { label: 'Tarjeta de Crédito', value: 'Tarjeta de Crédito' },
  { label: 'Crédito', value: 'Crédito' },
  { label: 'Persona', value: 'Persona' },
  { label: 'Individual', value: 'Individual' },
];

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, addDebt, updateDebt, deleteDebt } = useDebts();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');

  const isEditing = !!debtId;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setName(debtToEdit.name);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa nombre y monto.');
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert('Error', 'El monto debe ser numérico.');
      return;
    }

    const debtData = { name, amount: parseFloat(amount), type };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debtId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Nombre / Descripción"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        testID="debt-name-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="debt-amount-input"
      />

      <View style={styles.typeContainer}>
        <Text style={styles.typeLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          {DEBT_TYPES.map((t) => (
            <RadioButton.Item
              key={t.value}
              label={t.label}
              value={t.value}
              testID={`radio-${t.value}`}
            />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="save-button"
      >
        {isEditing ? 'Actualizar Deuda' : 'Agregar Deuda'}
      </Button>

      {isEditing && (
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
          textColor={theme.colors.error}
          testID="delete-button"
        >
          Eliminar Deuda
        </Button>
      )}
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
  typeContainer: {
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  deleteButton: {
    marginTop: 16,
    borderColor: '#B00020',
  }
});

export default AddEditDebtScreen;
