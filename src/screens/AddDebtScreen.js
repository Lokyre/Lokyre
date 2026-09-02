import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme, HelperText } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Crédito, Persona
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const { addDebt } = useDebts();
  const theme = useTheme();

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la deuda.');
      return;
    }
    if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    addDebt({
      name: name.trim(),
      amount: Number(amount),
      type,
      dueDate: dueDate.trim(),
      description: description.trim(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Nombre de la deuda"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          testID="input-name"
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          testID="input-amount"
        />

        <View style={styles.radioGroupContainer}>
          <Text variant="titleMedium" style={styles.radioGroupTitle}>
            Tipo de deuda:
          </Text>
          <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <Text>Tarjeta</Text>
                <RadioButton value="Tarjeta" testID="radio-tarjeta" />
              </View>
              <View style={styles.radioItem}>
                <Text>Crédito</Text>
                <RadioButton value="Crédito" testID="radio-credito" />
              </View>
              <View style={styles.radioItem}>
                <Text>Persona</Text>
                <RadioButton value="Persona" testID="radio-persona" />
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <TextInput
          label="Fecha de vencimiento (ej. 15/10/2023)"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          style={styles.input}
          testID="input-due-date"
        />

        <TextInput
          label="Descripción (Opcional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          testID="input-desc"
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          testID="save-button"
        >
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  radioGroupContainer: {
    marginBottom: 16,
  },
  radioGroupTitle: {
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 6,
  },
});

export default AddDebtScreen;
