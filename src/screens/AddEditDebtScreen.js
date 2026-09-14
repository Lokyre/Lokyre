import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [description, setDescription] = useState('');

  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      alert('Por favor completa el título y el monto.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount) || 0,
      type,
      description,
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
      <Title style={styles.headerTitle}>{isEditing ? 'Editar Deuda' : 'Nueva Deuda'}</Title>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        testID="input-title"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        testID="input-amount"
      />

      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={(newValue) => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Otro" value="Otro" testID="radio-otro" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
        testID="input-description"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        testID="save-button"
      >
        Guardar Deuda
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
  headerTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
