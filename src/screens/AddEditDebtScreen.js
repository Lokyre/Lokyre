import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Appbar } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddEditDebtScreen = ({ navigation, route }) => {
  const { addDebt, editDebt } = useContext(DebtContext);
  const debtToEdit = route.params?.debt;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Tarjetas');
  const [error, setError] = useState('');

  useEffect(() => {
    if (debtToEdit) {
      setTitle(debtToEdit.title);
      setAmount(debtToEdit.amount.toString());
      setCategory(debtToEdit.category);
    }
  }, [debtToEdit]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      setError('Por favor, ingresa el título y el monto.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Por favor, ingresa un monto válido mayor a cero.');
      return;
    }

    if (debtToEdit) {
      editDebt(debtToEdit.id, title.trim(), amount, category);
    } else {
      addDebt(title.trim(), amount, category);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={debtToEdit ? 'Editar Deuda' : 'Nueva Deuda'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Título (Ej. Tarjeta VISA)"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          testID="title-input"
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          testID="amount-input"
        />

        <Text variant="titleMedium" style={styles.categoryLabel}>Categoría:</Text>
        <RadioButton.Group onValueChange={newValue => setCategory(newValue)} value={category}>
          {categories.map((cat) => (
            <RadioButton.Item
              key={cat}
              label={cat}
              value={cat}
              testID={`radio-${cat}`}
            />
          ))}
        </RadioButton.Group>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          testID="save-button"
        >
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
  categoryLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default AddEditDebtScreen;
