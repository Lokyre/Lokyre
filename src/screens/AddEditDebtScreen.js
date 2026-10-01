import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};
  const editingDebt = debtId ? debts.find((d) => d.id === debtId) : null;

  const [name, setName] = useState(editingDebt ? editingDebt.name : '');
  const [amount, setAmount] = useState(editingDebt ? editingDebt.amount.toString() : '');
  const [type, setType] = useState(editingDebt ? editingDebt.type : 'Tarjetas');
  const [notes, setNotes] = useState(editingDebt ? editingDebt.notes || '' : '');
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      type,
      notes,
    };

    if (editingDebt) {
      updateDebt({ ...debtData, id: debtId, date: editingDebt.date });
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
        error={!!errors.name}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.amount}
      />
      {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <RadioButton.Item label="Tarjetas" value="Tarjetas" />
        <RadioButton.Item label="Créditos" value="Créditos" />
        <RadioButton.Item label="Personas" value="Personas" />
        <RadioButton.Item label="Individuales" value="Individuales" />
      </RadioButton.Group>

      <TextInput
        label="Notas Adicionales (Opcional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline={true}
        numberOfLines={4}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
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
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  }
});

export default AddEditDebtScreen;
