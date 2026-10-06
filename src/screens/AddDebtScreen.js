import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddDebtScreen = ({ navigation, route }) => {
  const { addDebt, editDebt, debts } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [description, setDescription] = useState('');

  const isEditing = !!debtId;

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      const errorMsg = 'Por favor, ingrese un título y un monto.';
      if (typeof globalThis.alert === 'function') {
        globalThis.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      const errorMsg = 'Por favor, ingrese un monto válido mayor a 0.';
      if (typeof globalThis.alert === 'function') {
        globalThis.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
      return;
    }

    const debtData = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      description: description.trim(),
      isPaid: false,
    };

    if (isEditing) {
      editDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Editar Deuda' : 'Agregar Deuda'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Título de la deuda"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.label}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          {isEditing ? 'Guardar Cambios' : 'Agregar Deuda'}
        </Button>
      </ScrollView>
    </SafeAreaView>
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
  textArea: {
    minHeight: 80,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
