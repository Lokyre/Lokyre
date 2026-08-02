import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor ingrese un título y un monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      type,
      description,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} testID="back-button" />
        <Appbar.Content title="Añadir Deuda" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <TextInput
          label="Título (Ej. Tarjeta VISA, Juan)"
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

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Tipo de deuda:</Text>
          <RadioButton.Group onValueChange={value => setType(value)} value={type}>
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
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
          testID="input-description"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
          Guardar Deuda
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
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default AddDebtScreen;
