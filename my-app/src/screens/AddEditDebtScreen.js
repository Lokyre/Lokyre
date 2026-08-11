import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, updateDebt, deleteDebt } = useContext(DebtContext);
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find(d => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro que deseas eliminar esta deuda?',
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
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo coche)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="debt-title-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="debt-amount-input"
      />

      <TextInput
        label="Fecha de Vencimiento (DD/MM/AAAA)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="debt-date-input"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
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
          <RadioButton value="Individual" testID="radio-individual" />
          <Text>Individual</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="save-debt-button"
      >
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>

      {isEditing && (
        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="red"
          style={styles.deleteButton}
          testID="delete-debt-button"
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
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  deleteButton: {
    marginTop: 16,
    borderColor: 'red',
  }
});
