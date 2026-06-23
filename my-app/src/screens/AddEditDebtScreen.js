import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, updateDebt } = useDebts();
  const editId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editId) {
      const debtToEdit = debts.find(d => d.id === editId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [editId, debts]);

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (Título, Monto, Fecha de vencimiento).');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'El monto debe ser un número válido.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (editId) {
      await updateDebt(editId, debtData);
    } else {
      await addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={editId ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Título *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          testID="input-title"
        />

        <TextInput
          label="Monto *"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          testID="input-amount"
        />

        <View style={styles.radioGroup}>
          <Text variant="titleMedium" style={styles.radioLabel}>Tipo de deuda:</Text>
          <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
            <View style={styles.radioOption}>
              <RadioButton value="Tarjeta" testID="radio-tarjeta" />
              <Text>Tarjeta</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Crédito" testID="radio-credito" />
              <Text>Crédito</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Persona" testID="radio-persona" />
              <Text>Persona</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Individual" testID="radio-individual" />
              <Text>Individual</Text>
            </View>
          </RadioButton.Group>
        </View>

        <TextInput
          label="Fecha de Vencimiento (DD/MM/AAAA) *"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          style={styles.input}
          testID="input-date"
        />

        <TextInput
          label="Descripción (Opcional)"
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
          testID="btn-save"
        >
          {editId ? 'Actualizar Deuda' : 'Guardar Deuda'}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  radioGroup: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  radioLabel: {
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

export default AddEditDebtScreen;
