import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddDebtScreen = () => {
  const { addDebt, editDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
        setDescription(debt.description || '');
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos requeridos (Título, Monto, Fecha de Vencimiento).');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount) || 0,
      type,
      dueDate,
      description,
    };

    if (isEditing) {
      editDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="title-input"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="amount-input"
      />

      <Text variant="titleMedium" style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta"/>
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito"/>
        </View>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona"/>
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual"/>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="duedate-input"
      />
      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="desc-input"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#6200ee">
        {isEditing ? 'Guardar Cambios' : 'Añadir Deuda'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  }
});

export default AddDebtScreen;
