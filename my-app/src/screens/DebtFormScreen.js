import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtFormScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const debtToEdit = route.params?.debt;

  const [title, setTitle] = useState(debtToEdit ? debtToEdit.title : '');
  const [amount, setAmount] = useState(debtToEdit ? debtToEdit.amount.toString() : '');
  const [type, setType] = useState(debtToEdit ? debtToEdit.type : 'Individual');
  const [description, setDescription] = useState(debtToEdit ? debtToEdit.description : '');

  const handleSubmit = () => {
    if (!title || !amount) {
      alert('Por favor ingrese un título y monto válidos.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      description,
    };

    if (debtToEdit) {
      updateDebt(debtToEdit.id, debtData);
    } else {
      addDebt(debtData);
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
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        multiline
      />

      <View style={styles.radioContainer}>
        <Text variant="titleMedium" style={styles.radioTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
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
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        {debtToEdit ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  radioContainer: {
    marginBottom: 16,
  },
  radioTitle: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});

export default DebtFormScreen;
