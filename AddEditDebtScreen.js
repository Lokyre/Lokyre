import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from './DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const isEditing = !!debtId;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjetas');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setName(debtToEdit.name);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!name || !amount) {
      if (globalThis.alert) {
         globalThis.alert('Error: Por favor completa el nombre y el monto.');
      } else {
         Alert.alert('Error', 'Por favor completa el nombre y el monto.');
      }
      return;
    }

    if (isNaN(parseFloat(amount))) {
       if (globalThis.alert) {
          globalThis.alert('Error: El monto debe ser un número válido.');
       } else {
          Alert.alert('Error', 'El monto debe ser un número válido.');
       }
       return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
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
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Editar Deuda' : 'Nueva Deuda'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Nombre (Deudor/Acreedor)"
          value={name}
          onChangeText={setName}
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

        <Text variant="titleMedium" style={styles.label}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos" />
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas" />
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales" />
        </RadioButton.Group>

        <TextInput
          label="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar
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
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
});

export default AddEditDebtScreen;
