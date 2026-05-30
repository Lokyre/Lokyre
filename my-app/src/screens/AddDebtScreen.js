import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebts();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('tarjetas');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !amount) {
      alert('Por favor, ingresa el título y el monto.');
      return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      category,
      dueDate,
      description,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Título (Ej. Tarjeta Visa, Préstamo Auto)"
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
        label="Fecha de Vencimiento (DD/MM/AAAA)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción (Opcional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.radioTitle}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
        <View style={styles.radioOption}>
          <RadioButton value="tarjetas" />
          <Text>Tarjetas</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="creditos" />
          <Text>Créditos</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="personas" />
          <Text>Personas</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="individuales" />
          <Text>Individuales</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={theme.colors.primary}
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  radioTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
