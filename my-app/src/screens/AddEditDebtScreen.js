import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { category, debtId } = route.params || {};
  const { debts, addDebt, editDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const isEditing = !!debtId;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(String(debtToEdit.amount));
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, debtId, debts]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Deuda' : 'Nueva Deuda',
    });
  }, [navigation, isEditing]);

  const validate = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!amount.trim()) {
      newErrors.amount = 'El monto es requerido';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'El monto debe ser un número válido mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      description: description.trim(),
      category: category,
    };

    try {
      if (isEditing) {
        await editDebt(debtId, debtData);
      } else {
        await addDebt(debtData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la deuda');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título de la deuda"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        error={!!errors.title}
      />
      {errors.title && <HelperText type="error">{errors.title}</HelperText>}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.amount}
        left={<TextInput.Affix text="$" />}
      />
      {errors.amount && <HelperText type="error">{errors.amount}</HelperText>}

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor="#1976d2"
      >
        Guardar
      </Button>
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
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
