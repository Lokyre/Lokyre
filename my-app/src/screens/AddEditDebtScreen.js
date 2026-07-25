import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddEditDebtScreen() {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const debtId = route.params?.debtId;
  const isEditing = !!debtId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(String(debtToEdit.amount));
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos (Título, Monto, Fecha).');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description
    };

    if (isEditing) {
      updateDebt(debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} testID="back-button" />
        <Appbar.Content title={isEditing ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Título (Ej. Tarjeta Visa, Préstamo Auto)"
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

        <Text style={styles.label}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioContainer}>
            <View style={styles.radioItem}><RadioButton value="Tarjeta" testID="radio-tarjeta" /><Text>Tarjeta</Text></View>
            <View style={styles.radioItem}><RadioButton value="Crédito" testID="radio-credito" /><Text>Crédito</Text></View>
            <View style={styles.radioItem}><RadioButton value="Persona" testID="radio-persona" /><Text>Persona</Text></View>
            <View style={styles.radioItem}><RadioButton value="Individual" testID="radio-individual" /><Text>Individual</Text></View>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Fecha de Vencimiento (DD/MM/AAAA)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          testID="input-due-date"
        />

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  }
});