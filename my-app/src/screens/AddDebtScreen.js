import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function AddDebtScreen({ navigation }) {
  const { addDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      await addDebt({
        title,
        amount: parseFloat(amount),
        type,
        description,
        dueDate,
      });
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título (Ej. Alquiler, Juan, Tarjeta Visa)"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          error={!!errors.title}
          testID="input-title"
        />
        <HelperText type="error" visible={!!errors.title}>
          {errors.title}
        </HelperText>

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          error={!!errors.amount}
          testID="input-amount"
        />
        <HelperText type="error" visible={!!errors.amount}>
          {errors.amount}
        </HelperText>

        <Title style={styles.radioTitle}>Tipo de Deuda</Title>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <Text>Individual</Text>
              <RadioButton value="Individual" />
            </View>
            <View style={styles.radioItem}>
              <Text>Tarjeta</Text>
              <RadioButton value="Tarjeta" />
            </View>
            <View style={styles.radioItem}>
              <Text>Crédito</Text>
              <RadioButton value="Crédito" />
            </View>
            <View style={styles.radioItem}>
              <Text>Persona</Text>
              <RadioButton value="Persona" />
            </View>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Fecha de Vencimiento (Opcional)"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          style={styles.input}
          placeholder="DD/MM/YYYY"
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
          testID="input-description"
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  radioTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
