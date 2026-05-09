import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, editDebt } = useContext(DebtContext);
  const theme = useTheme();

  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Individual');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditing) {
      const existingDebt = debts.find(d => d.id === debtId);
      if (existingDebt) {
        setName(existingDebt.name);
        setAmount(existingDebt.amount.toString());
        setCategory(existingDebt.category);
        setDueDate(existingDebt.dueDate || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!name || !amount) {
      alert('Por favor, ingresa el nombre y el monto.');
      return;
    }

    const debtData = {
      name,
      amount: parseFloat(amount),
      category,
      dueDate
    };

    if (isEditing) {
      editDebt({ ...debtData, id: debtId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {isEditing ? 'Editar Deuda' : 'Nueva Deuda'}
      </Text>

      <TextInput
        label="Nombre de la deuda / Entidad"
        value={name}
        onChangeText={setName}
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
        left={<TextInput.Affix text="$" />}
      />

      <Text variant="titleMedium" style={styles.label}>Categoría</Text>
      <SegmentedButtons
        value={category}
        onValueChange={setCategory}
        buttons={[
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
          { value: 'Persona', label: 'Persona' },
          { value: 'Individual', label: 'Individ.' },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Fecha de Vencimiento (ej. 2024-12-31)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
