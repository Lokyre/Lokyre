import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddEditDebtScreen = ({ navigation, route }) => {
  const { addDebt, updateDebt } = useContext(DebtContext);
  const debtToEdit = route.params?.debt;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual'); // Tarjeta, Crédito, Persona, Individual
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (debtToEdit) {
      setTitle(debtToEdit.title);
      setAmount(debtToEdit.amount.toString());
      setType(debtToEdit.type);
      setDate(debtToEdit.date);
    }
  }, [debtToEdit]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa el título y el monto de la deuda.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    const debtData = {
      title,
      amount: parseFloat(amount),
      type,
      date,
    };

    if (debtToEdit) {
      updateDebt({ ...debtData, id: debtToEdit.id });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta VISA, Juan)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="debt-title-input"
      />

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        testID="debt-amount-input"
      />

      <TextInput
        label="Fecha (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
        style={styles.input}
        testID="debt-date-input"
      />

      <View style={styles.typeSection}>
        <Text style={styles.typeLabel}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="Individual" testID="radio-individual" />
              <Text>Individual</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Tarjeta" testID="radio-tarjeta" />
              <Text>Tarjeta</Text>
            </View>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="Crédito" testID="radio-credito" />
              <Text>Crédito</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Persona" testID="radio-persona" />
              <Text>Persona</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-button">
        {debtToEdit ? 'Actualizar Deuda' : 'Guardar Deuda'}
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
  input: {
    marginBottom: 16,
  },
  typeSection: {
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
