import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Appbar, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddDebtScreen = () => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const editingId = route.params?.debtId;
  const isEditing = !!editingId;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual'); // Tarjeta, Crédito, Persona, Individual
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find(d => d.id === editingId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate || '');
        setDescription(debtToEdit.description || '');
      }
    }
  }, [isEditing, editingId, debts]);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor, ingrese un título y un monto.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      dueDate,
      description,
      isPaid: isEditing ? debts.find(d => d.id === editingId)?.isPaid : false,
    };

    if (isEditing) {
      updateDebt(editingId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Editar Deuda' : 'Agregar Deuda'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
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

        <Text style={styles.label}>Tipo de deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <RadioButton.Item label="Individual" value="Individual" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" />
          <RadioButton.Item label="Persona" value="Persona" />
        </RadioButton.Group>

        <TextInput
          label="Fecha de Vencimiento (Opcional)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
          placeholder="Ej: 2024-12-31"
        />

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          {isEditing ? 'Guardar Cambios' : 'Agregar Deuda'}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 16 },
  input: { marginBottom: 12 },
  label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  button: { marginTop: 20, paddingVertical: 5 }
});

export default AddDebtScreen;