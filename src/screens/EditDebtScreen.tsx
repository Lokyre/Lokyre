import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const EditDebtScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, updateDebt } = useDebts();

  const debt = debts.find((d) => d.id === debtId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (debt) {
      setTitle(debt.title);
      setAmount(debt.amount.toString());
      setType(debt.type);
      setNotes(debt.notes);
    }
  }, [debt]);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    if (!title || !amount) {
      globalThis.alert ? globalThis.alert('Por favor ingrese título y monto.') : alert('Por favor ingrese título y monto.');
      return;
    }

    updateDebt(debtId, {
      title,
      amount,
      type,
      notes,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.radioGroup}>
        <Text style={styles.label}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

      <TextInput
        label="Notas / Detalles"
        value={notes}
        onChangeText={setNotes}
        multiline={true}
        numberOfLines={4}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Actualizar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 15,
  },
  radioGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    marginBottom: 40,
    paddingVertical: 5,
  },
});

export default EditDebtScreen;
