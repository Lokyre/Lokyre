import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function AddEditDebtScreen({ route, navigation }) {
  const { debts, addDebt, editDebt } = useDebts();
  const debtId = route.params?.debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (debtId) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setNotes(debtToEdit.notes || '');
      }
    }
  }, [debtId, debts]);

  const validate = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
       if (Platform.OS === 'web') {
           globalThis.alert('Por favor, corrija los errores en el formulario.');
       } else {
           Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
       }
       return;
    }

    const debtData = { title, amount, type, notes };

    if (debtId) {
      await editDebt(debtId, debtData);
    } else {
      await addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título (Ej. Alquiler, Tarjeta Visa)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        error={!!errors.title}
        testID="title-input"
      />
      {errors.title ? <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText> : null}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.amount}
        testID="amount-input"
      />
      {errors.amount ? <HelperText type="error" visible={!!errors.amount}>{errors.amount}</HelperText> : null}

      <Text style={styles.label}>Tipo de Deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Individuales', label: 'Indiv.' },
          { value: 'Tarjetas', label: 'Tarjetas' },
          { value: 'Créditos', label: 'Créditos' },
          { value: 'Personas', label: 'Personas' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Notas (Opcional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="notes-input"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
