import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddEditDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt } = useDebts();
  const existingDebt = route.params?.debt;

  const [title, setTitle] = useState(existingDebt ? existingDebt.title : '');
  const [amount, setAmount] = useState(existingDebt ? existingDebt.amount.toString() : '');
  const [type, setType] = useState(existingDebt ? existingDebt.type : 'Tarjeta');
  const [dueDate, setDueDate] = useState(existingDebt ? existingDebt.dueDate : '');
  const [description, setDescription] = useState(existingDebt ? existingDebt.description : '');

  const handleSave = async () => {
    if (!title || !amount || !dueDate) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios (Título, Monto, Fecha).');
      return;
    }

    const debtData = { title, amount, type, dueDate, description };

    try {
      if (existingDebt) {
        await updateDebt(existingDebt.id, debtData);
      } else {
        await addDebt(debtData);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la deuda.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={existingDebt ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Título (Ej. Tarjeta VISA)"
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

        <TextInput
          label="Fecha de Vencimiento (DD/MM/AAAA)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          testID="input-date"
        />

        <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
            <RadioButton value="Tarjeta" />
            <Text>Tarjeta</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Crédito" />
            <Text>Crédito</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Persona" />
            <Text>Persona</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Individual" />
            <Text>Individual</Text>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, { marginTop: 15 }]}
          testID="input-desc"
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          testID="btn-save"
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
  scrollContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
});

export default AddEditDebtScreen;
