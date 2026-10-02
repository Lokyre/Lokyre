import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, RadioButton, Title } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debt } = route?.params || {};
  const isEditing = !!debt;
  const { addDebt, updateDebt } = useDebtContext();

  const [title, setTitle] = useState(debt?.title || '');
  const [amount, setAmount] = useState(debt?.amount?.toString() || '');
  const [category, setCategory] = useState(debt?.category || CATEGORIES[0]);
  const [description, setDescription] = useState(debt?.description || '');
  const [dueDate, setDueDate] = useState(debt?.dueDate || '');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      const alertMsg = 'El título y el monto son obligatorios';
      if (Platform.OS === 'web') {
        globalThis.alert(alertMsg);
      } else {
        alert(alertMsg);
      }
      return;
    }

    const debtData = {
      id: debt?.id,
      title,
      amount: parseFloat(amount),
      category,
      description,
      dueDate,
    };

    if (isEditing) {
      updateDebt(debtData);
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
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Fecha de vencimiento (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="Opcional"
      />

      <Title style={styles.radioTitle}>Categoría</Title>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        {CATEGORIES.map((cat) => (
          <RadioButton.Item key={cat} label={cat} value={cat} testID={`radio-${cat}`} />
        ))}
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
    marginBottom: 16,
  },
  radioTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
