import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      const debtToEdit = debts.find((d) => d.id === id);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(new Date(debtToEdit.dueDate));
        setDescription(debtToEdit.description);
      }
    }
  }, [id, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y la cantidad.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate: dueDate.toISOString(),
      description,
    };

    if (id) {
      updateDebt(id, debtData);
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Deuda"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Cantidad"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text style={styles.label}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioRow}>
            <RadioButton value="Tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Crédito" />
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Individual" />
            <Text>Individual</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.label}>Fecha de Vencimiento:</Text>
        <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
          {dueDate.toLocaleDateString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>
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
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  radioContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateBtn: {
    alignItems: 'flex-start',
  },
  saveBtn: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddEditDebtScreen;
