import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme, Appbar, HelperText } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const { addDebt } = useDebtContext();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Individuales');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      setError('Por favor, completa el título y el monto.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
       setError('El monto debe ser un número válido.');
       return;
    }

    addDebt({
      title,
      amount: parseFloat(amount),
      category,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nueva Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          label="Título (Ej. Tarjeta VISA, Juan)"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.categoryLabel}>
          Categoría
        </Text>

        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          <RadioButton.Item label="Individuales" value="Individuales" testID="radio-individuales"/>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" testID="radio-tarjetas"/>
          <RadioButton.Item label="Créditos" value="Créditos" testID="radio-creditos"/>
          <RadioButton.Item label="Personas" value="Personas" testID="radio-personas"/>
        </RadioButton.Group>

        {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          testID="save-button"
        >
          Guardar Deuda
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  categoryLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
  },
});

export default AddDebtScreen;
