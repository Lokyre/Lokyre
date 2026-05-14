import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Tarjeta'); // Tarjeta, Credito, Persona, Individual
  const [dueDate, setDueDate] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    let parsedDate = null;
    if (dueDate) {
      parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
         Alert.alert('Error', 'Formato de fecha inválido. Usa AAAA-MM-DD');
         return;
      }
    }

    await addDebt({
      title,
      amount: parsedAmount,
      type,
      dueDate: parsedDate ? parsedDate.toISOString() : null,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título o Descripción"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Monto Total"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha de Vencimiento (AAAA-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        mode="outlined"
        placeholder="Opcional"
      />

      <Text style={styles.label}>Tipo de Deuda:</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" color={theme.colors.primary} />
          <RadioButton.Item label="Crédito" value="Credito" color={theme.colors.primary} />
          <RadioButton.Item label="Persona" value="Persona" color={theme.colors.primary} />
          <RadioButton.Item label="Individual" value="Individual" color={theme.colors.primary} />
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={theme.colors.primary}
      >
        Guardar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  radioContainer: {
    marginBottom: 24,
  },
  button: {
    paddingVertical: 8,
    marginBottom: 32,
  }
});
