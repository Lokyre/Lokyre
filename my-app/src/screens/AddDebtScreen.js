import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const theme = useTheme();

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
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDueDate(debtToEdit.dueDate);
        setDescription(debtToEdit.description || '');
      }
    }
  }, [debtId, debts]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      alert("Por favor completa los campos obligatorios: Título, Monto y Fecha.");
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Título de la deuda *"
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
          label="Fecha de Vencimiento (ej. 2023-12-31) *"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.label}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioGroup}>
            <View style={styles.radioItem}><RadioButton value="Tarjeta" /><Text>Tarjeta</Text></View>
            <View style={styles.radioItem}><RadioButton value="Crédito" /><Text>Crédito</Text></View>
            <View style={styles.radioItem}><RadioButton value="Persona" /><Text>Persona</Text></View>
            <View style={styles.radioItem}><RadioButton value="Individual" /><Text>Individual</Text></View>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, { marginTop: 10 }]}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          buttonColor={theme.colors.primary}
        >
          {isEditing ? "Guardar Cambios" : "Agregar Deuda"}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: { marginBottom: 15 },
  label: { marginTop: 10, marginBottom: 5, fontSize: 16, fontWeight: 'bold' },
  radioGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  radioItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10 },
  button: { marginTop: 20, paddingVertical: 5 }
});

export default AddDebtScreen;
