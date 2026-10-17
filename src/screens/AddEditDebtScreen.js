import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme, Appbar, HelperText } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddEditDebtScreen = ({ route, navigation }) => {
  const { debts, addDebt, editDebt } = useContext(DebtContext);
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;
  const existingDebt = isEditing ? debts.find(d => d.id === debtId) : null;

  const [title, setTitle] = useState(existingDebt ? existingDebt.title : '');
  const [amount, setAmount] = useState(existingDebt ? existingDebt.amount.toString() : '');
  const [type, setType] = useState(existingDebt ? existingDebt.type : 'Tarjetas');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!amount.trim()) newErrors.amount = 'El monto es requerido';
    else if (isNaN(amount) || parseFloat(amount) <= 0) newErrors.amount = 'El monto debe ser un número mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const debtData = {
      id: isEditing ? existingDebt.id : uuidv4(),
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      date: isEditing ? existingDebt.date : new Date().toISOString(),
    };

    if (isEditing) {
      editDebt(debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? "Editar Deuda" : "Nueva Deuda"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <TextInput
            label="Título"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            error={!!errors.title}
            testID="title-input"
          />
          <HelperText type="error" visible={!!errors.title}>
            {errors.title}
          </HelperText>

          <TextInput
            label="Monto"
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.amount}
            testID="amount-input"
          />
          <HelperText type="error" visible={!!errors.amount}>
            {errors.amount}
          </HelperText>

          <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Deuda</Text>

          <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
            <View style={styles.radioGroup}>
              {DEBT_TYPES.map((debtType) => (
                <RadioButton.Item
                  key={debtType}
                  label={debtType}
                  value={debtType}
                  testID={`radio-${debtType}`}
                />
              ))}
            </View>
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            testID="save-button"
          >
            Guardar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 24,
  },
  input: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  radioGroup: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddEditDebtScreen;
