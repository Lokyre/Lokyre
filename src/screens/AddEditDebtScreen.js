import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, RadioButton, Title, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Individual');

  useEffect(() => {
    if (id) {
      const debt = debts.find(d => d.id === id);
      if (debt) {
        setTitle(debt.title);
        setAmount(debt.amount.toString());
        setDescription(debt.description || '');
        setType(debt.type);
      }
    }
  }, [id, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor ingrese título y monto');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      description,
      type
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
      <Title style={styles.header}>{id ? 'Editar Deuda' : 'Agregar Nueva Deuda'}</Title>

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

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
        testID="input-description"
      />

      <View style={styles.radioContainer}>
        <Title style={styles.radioTitle}>Tipo de Deuda</Title>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
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
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  radioContainer: {
    marginVertical: 15,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;