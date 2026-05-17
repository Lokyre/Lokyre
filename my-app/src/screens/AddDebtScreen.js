import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ route, navigation }) => {
  const { addDebt } = useContext(DebtContext);
  const initialCategory = route.params?.category || 'Tarjetas';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialCategory);

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor completa todos los campos.');
      return;
    }

    addDebt(title, amount, category);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título o Descripción"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto Total"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjetas" />
          <Text>Tarjetas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Créditos" />
          <Text>Créditos</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Personas" />
          <Text>Personas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individuales" />
          <Text>Individuales</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
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
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddDebtScreen;
