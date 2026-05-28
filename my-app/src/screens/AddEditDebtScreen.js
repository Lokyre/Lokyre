import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useContext(DebtContext);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('individual'); // tarjetas, creditos, personas, individual

  useEffect(() => {
    if (id) {
      const debtToEdit = debts.find((d) => d.id === id);
      if (debtToEdit) {
        setDescription(debtToEdit.description);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
      }
    }
  }, [id, debts]);

  const handleSave = () => {
    if (!description || !amount) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const debtData = {
      description,
      amount: parseFloat(amount),
      type,
    };

    if (id) {
      updateDebt(id, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Descripción (Ej. Tarjeta Visa, Préstamo Juan)"
        value={description}
        onChangeText={setDescription}
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

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Individual" value="individual" />
          <RadioButton.Item label="Tarjeta" value="tarjeta" />
          <RadioButton.Item label="Crédito" value="credito" />
          <RadioButton.Item label="Persona" value="persona" />
        </View>
      </RadioButton.Group>

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
    fontWeight: 'bold',
  },
  radioContainer: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});

export default AddEditDebtScreen;
