import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, HelperText } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddEditDebtScreen = () => {
  const { addDebt, updateDebt } = useDebtContext();
  const navigation = useNavigation();
  const route = useRoute();

  const editingDebt = route.params?.debt;

  const [title, setTitle] = useState(editingDebt ? editingDebt.title : '');
  const [amount, setAmount] = useState(editingDebt ? editingDebt.amount.toString() : '');
  const [type, setType] = useState(editingDebt ? editingDebt.type : 'Tarjeta');
  const [description, setDescription] = useState(editingDebt ? editingDebt.description : '');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingDebt) {
      navigation.setOptions({ title: 'Editar Deuda' });
    }
  }, [editingDebt, navigation]);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
      valid = false;
    }
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'El monto debe ser un número válido mayor a 0';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validate()) {
      const debtData = {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        description: description.trim(),
      };

      if (editingDebt) {
        updateDebt({ ...editingDebt, ...debtData });
      } else {
        addDebt(debtData);
      }
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título (Ej. Tarjeta de Crédito X)"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        testID="input-title"
      />
      <HelperText type="error" visible={!!errors.title}>
        {errors.title}
      </HelperText>

      <TextInput
        label="Monto"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        testID="input-amount"
      />
      <HelperText type="error" visible={!!errors.amount}>
        {errors.amount}
      </HelperText>

      <Title style={styles.typeTitle}>Tipo de Deuda</Title>
      <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
          <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
          <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
          <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
        </View>
      </RadioButton.Group>

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
        testID="btn-save-debt"
      >
        {editingDebt ? 'Guardar Cambios' : 'Agregar Deuda'}
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
    marginBottom: 4,
  },
  typeTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
