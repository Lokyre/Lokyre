import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DEBT_TYPES = ['Tarjeta', 'Crédito', 'Persona', 'Individual'];

const AddEditDebtScreen = ({ navigation, route }) => {
  const { debts, addDebt, editDebt } = useDebts();
  const theme = useTheme();

  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState(''); // Simple string for now, could use a date picker
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(String(debtToEdit.amount));
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate ? new Date(debtToEdit.dueDate).toISOString().split('T')[0] : '');
        setDescription(debtToEdit.description || '');
      }
    }
  }, [debtId, isEditing, debts]);

  const validate = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    // Basic date format validation YYYY-MM-DD if provided
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      newErrors.dueDate = 'Formato inválido (YYYY-MM-DD)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      description: description.trim(),
    };

    if (isEditing) {
      editDebt({ ...debtData, id: debtId, isPaid: debts.find(d => d.id === debtId).isPaid });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="input-title"
        error={!!errors.title}
      />
      {errors.title ? <HelperText type="error">{errors.title}</HelperText> : null}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
        error={!!errors.amount}
      />
      {errors.amount ? <HelperText type="error">{errors.amount}</HelperText> : null}

      <Text variant="titleMedium" style={styles.label}>
        Tipo de Deuda
      </Text>
      <RadioButton.Group onValueChange={(value) => setType(value)} value={type}>
        <View style={styles.radioGroup}>
          {DEBT_TYPES.map((t) => (
            <View key={t} style={styles.radioItem}>
              <RadioButton value={t} />
              <Text>{t}</Text>
            </View>
          ))}
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (YYYY-MM-DD) opcional"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
        testID="input-date"
        error={!!errors.dueDate}
      />
      {errors.dueDate ? <HelperText type="error">{errors.dueDate}</HelperText> : null}

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={theme.colors.primary}
      >
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
