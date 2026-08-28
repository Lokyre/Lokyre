import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt, debts } = useDebtContext();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;
  const existingDebt = isEditing ? debts.find(d => d.id === debtId) : null;

  const [title, setTitle] = useState(existingDebt ? existingDebt.title : '');
  const [amount, setAmount] = useState(existingDebt ? existingDebt.amount.toString() : '');
  const [type, setType] = useState(existingDebt ? existingDebt.type : 'Tarjetas');

  // Basic date handling for simplicity. A date picker would be better in production.
  // Using string format YYYY-MM-DD
  const [dueDate, setDueDate] = useState(
    existingDebt ? new Date(existingDebt.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(existingDebt ? existingDebt.description || '' : '');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && existingDebt) {
      navigation.setOptions({ title: 'Editar Deuda' });
    } else {
      navigation.setOptions({ title: 'Nueva Deuda' });
    }
  }, [isEditing, navigation, existingDebt]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }

    // Simple date validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dueDate.match(dateRegex)) {
      newErrors.dueDate = 'Formato de fecha inválido (AAAA-MM-DD)';
    } else {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        newErrors.dueDate = 'Fecha inválida';
      }
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
      dueDate: new Date(dueDate).toISOString(),
      description: description.trim(),
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        error={!!errors.title}
        style={styles.input}
      />
      {errors.title && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.title}</Text>}

      <TextInput
        label="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        error={!!errors.amount}
        style={styles.input}
      />
      {errors.amount && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.amount}</Text>}

      <View style={styles.radioGroup}>
        <Text variant="titleMedium" style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioItem}>
            <RadioButton value="Tarjetas" />
            <Text>Tarjetas</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Créditos" />
            <Text>Créditos</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Personas" />
            <Text>Personas</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="Individuales" />
            <Text>Individuales</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Fecha de Vencimiento (AAAA-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        error={!!errors.dueDate}
        style={styles.input}
      />
      {errors.dueDate && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.dueDate}</Text>}

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        Guardar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  radioGroup: {
    marginVertical: 16,
  },
  radioLabel: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});

export default AddEditDebtScreen;
