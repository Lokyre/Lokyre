import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useDebts();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === id);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [id, debts]);

  const validate = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    if (!dueDate.trim()) newErrors.dueDate = 'La fecha de vencimiento es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const debtData = {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        dueDate: dueDate.trim(),
        description: description.trim(),
      };

      if (isEditing) {
        updateDebt(id, debtData);
      } else {
        addDebt(debtData);
      }
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Por favor, revise los campos marcados en rojo.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
        error={!!errors.title}
      />
      {errors.title && <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText>}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
        error={!!errors.amount}
      />
      {errors.amount && <HelperText type="error" visible={!!errors.amount}>{errors.amount}</HelperText>}

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
        error={!!errors.dueDate}
      />
      {errors.dueDate && <HelperText type="error" visible={!!errors.dueDate}>{errors.dueDate}</HelperText>}

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <Text>Tarjeta</Text>
            <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          </View>
          <View style={styles.radioItem}>
            <Text>Crédito</Text>
            <RadioButton value="Crédito" testID="radio-credito" />
          </View>
          <View style={styles.radioItem}>
            <Text>Persona</Text>
            <RadioButton value="Persona" testID="radio-persona" />
          </View>
          <View style={styles.radioItem}>
            <Text>Individual</Text>
            <RadioButton value="Individual" testID="radio-individual" />
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Descripción (opcional)"
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
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
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
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
