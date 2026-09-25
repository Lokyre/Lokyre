import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, HelperText } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function AddEditDebtScreen({ navigation, route }) {
  const { debts, addDebt, updateDebt } = useDebtContext();
  const { debtId } = route?.params || {};

  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Individuales');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const debt = debts.find((d) => d.id === debtId);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setCategory(debt.category);
        setDescription(debt.description || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      description: description.trim(),
    };

    if (isEditing) {
      updateDebt({ ...debtData, id: debtId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.headerTitle}>
        {isEditing ? 'Editar Deuda' : 'Nueva Deuda'}
      </Title>

      <TextInput
        label="Título"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setErrors({ ...errors, title: null });
        }}
        mode="outlined"
        style={styles.input}
        testID="debt-title-input"
      />
      {errors.title ? <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText> : null}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setErrors({ ...errors, amount: null });
        }}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="debt-amount-input"
      />
      {errors.amount ? <HelperText type="error" visible={!!errors.amount}>{errors.amount}</HelperText> : null}

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="debt-description-input"
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Categoría</Text>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        testID="save-debt-button"
      >
        Guardar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  categoryContainer: {
    marginVertical: 15,
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 8,
    marginBottom: 40,
    backgroundColor: '#1976D2',
  },
});
