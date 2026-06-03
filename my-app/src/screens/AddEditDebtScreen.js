import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Appbar } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, editDebt } = useContext(DebtContext);
  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description);
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert('Por favor, llena todos los campos obligatorios (Título, Monto, Fecha).');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
    };

    if (isEditing) {
      editDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Título *"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Monto *"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Fecha de Vencimiento *"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="DD/MM/AAAA"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.radioLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <Text>Tarjeta</Text>
              <RadioButton value="Tarjeta" />
            </View>
            <View style={styles.radioItem}>
              <Text>Crédito</Text>
              <RadioButton value="Crédito" />
            </View>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <Text>Persona</Text>
              <RadioButton value="Persona" />
            </View>
            <View style={styles.radioItem}>
              <Text>Individual</Text>
              <RadioButton value="Individual" />
            </View>
          </View>
        </RadioButton.Group>

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
  scrollContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  radioLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
