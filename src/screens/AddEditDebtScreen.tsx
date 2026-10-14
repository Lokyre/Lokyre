import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { DebtType } from '../types/Debt';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  AddEditDebt: { debtId?: string };
};

const AddEditDebtScreen = () => {
  const { addDebt, updateDebt, deleteDebt, debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddEditDebt'>>();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;
  const existingDebt = debts.find(d => d.id === debtId);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<DebtType>('Tarjetas');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing && existingDebt) {
      setName(existingDebt.name);
      setAmount(existingDebt.amount.toString());
      setType(existingDebt.type);
      setDueDate(existingDebt.dueDate);
      setDescription(existingDebt.description || '');
    }
  }, [isEditing, existingDebt]);

  const handleSave = () => {
    if (!name.trim()) {
      globalThis.alert ? globalThis.alert('Error: El nombre es requerido') : Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      globalThis.alert ? globalThis.alert('Error: El monto debe ser un número válido mayor a 0') : Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }
    if (!dueDate.trim()) {
      globalThis.alert ? globalThis.alert('Error: La fecha de vencimiento es requerida') : Alert.alert('Error', 'La fecha de vencimiento es requerida');
      return;
    }

    const debtData = {
      name: name.trim(),
      amount: parsedAmount,
      type,
      dueDate: dueDate.trim(),
      description: description.trim(),
    };

    if (isEditing && existingDebt) {
      updateDebt({ ...debtData, id: existingDebt.id });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (isEditing && existingDebt) {
      deleteDebt(existingDebt.id);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{isEditing ? 'Editar Deuda' : 'Nueva Deuda'}</Title>

      <TextInput
        label="Nombre (Ej. Tarjeta VISA)"
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
      />

      <View style={styles.radioContainer}>
        <Text style={styles.label}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={(value) => setType(value as DebtType)} value={type}>
          <RadioButton.Item label="Tarjetas" value="Tarjetas" />
          <RadioButton.Item label="Créditos" value="Créditos" />
          <RadioButton.Item label="Personas" value="Personas" />
          <RadioButton.Item label="Individuales" value="Individuales" />
        </RadioButton.Group>
      </View>

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

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        {isEditing ? 'Guardar Cambios' : 'Agregar Deuda'}
      </Button>

      {isEditing ? (
        <Button mode="outlined" onPress={handleDelete} style={styles.buttonDelete} color={theme.colors.error}>
          Eliminar Deuda
        </Button>
      ) : null}

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
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
  },
  buttonDelete: {
    marginBottom: 32,
    borderColor: 'red',
  },
});

export default AddEditDebtScreen;
