import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const editingId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingId) {
      const debtToEdit = debts.find((d) => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description);
      }
    }
  }, [editingId, debts]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa al menos el título y el monto.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (editingId) {
      updateDebt(editingId, debtData);
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta VISA)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjeta" testID="radio-tarjeta" />
          <Text>Tarjeta</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Crédito" testID="radio-credito" />
          <Text>Crédito</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Persona" testID="radio-persona" />
          <Text>Persona</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individual" testID="radio-individual" />
          <Text>Individual</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (DD/MM/AAAA)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-duedate"
      />
      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        testID="input-description"
      />

      <Button mode="contained" onPress={handleSave} style={styles.saveButton} testID="btn-save">
        {editingId ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
