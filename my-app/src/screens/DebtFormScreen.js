import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, RadioButton, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtFormScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { debts, addDebt, editDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      const debt = debts.find((d) => d.id === id);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setType(debt.type);
        setDueDate(debt.dueDate);
        setDescription(debt.description || '');
      }
    }
  }, [id, debts]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, completa los campos obligatorios: Título, Monto y Fecha.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (id) {
      editDebt({ ...debtData, id, isPaid: debts.find((d) => d.id === id).isPaid });
    } else {
      addDebt(debtData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        testID="input-title"
      />
      <TextInput
        label="Monto *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />

      <Title style={styles.sectionTitle}>Tipo de Deuda</Title>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        </View>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (DD/MM/AAAA) *"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        testID="input-dueDate"
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

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
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
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 6,
  },
});

export default DebtFormScreen;
