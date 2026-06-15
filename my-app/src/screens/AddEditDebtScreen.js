import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, editDebt } = useContext(DebtContext);
  const editingId = route.params?.id;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingId) {
      const debtToEdit = debts.find(d => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate || '');
        setDescription(debtToEdit.description || '');
      }
    }
  }, [editingId, debts]);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa al menos un título y un monto.');
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

    if (editingId) {
      await editDebt(editingId, debtData);
    } else {
      await addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <Text>Tarjeta</Text>
            <RadioButton value="Tarjeta" />
          </View>
          <View style={styles.radioItem}>
            <Text>Crédito</Text>
            <RadioButton value="Crédito" />
          </View>
          <View style={styles.radioItem}>
            <Text>Persona</Text>
            <RadioButton value="Persona" />
          </View>
          <View style={styles.radioItem}>
            <Text>Individual</Text>
            <RadioButton value="Individual" />
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (ej. YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar
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
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
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
    marginTop: 16,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
