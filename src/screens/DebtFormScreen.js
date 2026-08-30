import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtFormScreen({ route, navigation }) {
  const { debts, addDebt, updateDebt } = useContext(DebtContext);
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Personal');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setName(debtToEdit.name);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        setDescription(debtToEdit.description || '');
        setDueDate(debtToEdit.dueDate || '');
      }
    }
  }, [isEditing, debtId, debts]);

  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const debtData = {
        name: name.trim(),
        amount: parseFloat(amount),
        type,
        description: description.trim(),
        dueDate: dueDate.trim(),
      };

      if (isEditing) {
        updateDebt({ ...debtData, id: debtId, isPaid: debts.find(d => d.id === debtId).isPaid });
      } else {
        addDebt(debtData);
      }
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre (Acreedor/Deudor)"
        value={name}
        onChangeText={setName}
        mode="outlined"
        error={!!errors.name}
        style={styles.input}
        testID="input-name"
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        error={!!errors.amount}
        style={styles.input}
        testID="input-amount"
      />
      {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      <Text style={styles.label}>Tipo de Deuda</Text>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Personal" value="Personal" testID="radio-personal" />
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de Vencimiento (Opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        mode="outlined"
        placeholder="DD/MM/AAAA"
        style={styles.input}
        testID="input-dueDate"
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

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        testID="btn-save"
      >
        {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#b00020',
    fontSize: 12,
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
