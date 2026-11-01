import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const debtTypes = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddEditDebtScreen = ({ route, navigation }) => {
  const debtId = route.params?.debtId;
  const { debts, addDebt, updateDebt } = useContext(DebtContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individuales');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (debtId) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setTitle(debtToEdit.title);
        setAmount(debtToEdit.amount.toString());
        setType(debtToEdit.type);
        navigation.setOptions({ title: 'Editar Deuda' });
      }
    } else {
      navigation.setOptions({ title: 'Nueva Deuda' });
    }
  }, [debtId, debts, navigation]);

  const handleSave = () => {
    let currentErrors = {};
    if (!title.trim()) {
      currentErrors.title = 'El título es requerido';
    }
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      currentErrors.amount = 'Ingrese un monto válido';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    if (debtId) {
      updateDebt(debtId, title, amount, type);
    } else {
      addDebt(title, amount, type);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          error={!!errors.title}
        />
        {errors.title ? <HelperText type="error">{errors.title}</HelperText> : null}
      </View>

      <View style={styles.formGroup}>
        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          error={!!errors.amount}
        />
        {errors.amount ? <HelperText type="error">{errors.amount}</HelperText> : null}
      </View>

      <View style={styles.formGroup}>
        <Text variant="titleMedium" style={styles.label}>Tipo de Deuda:</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          {debtTypes.map((dt) => (
            <RadioButton.Item key={dt} label={dt} value={dt} testID={`radio-${dt}`} />
          ))}
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Guardar
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 40,
    backgroundColor: '#6200ee',
  },
});

export default AddEditDebtScreen;
