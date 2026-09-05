import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme, Surface } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtFormScreen = () => {
  const { debts, addDebt, updateDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const isEditing = !!debtId;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');

  useEffect(() => {
    if (isEditing) {
      const debtToEdit = debts.find((d) => d.id === debtId);
      if (debtToEdit) {
        setDescription(debtToEdit.description);
        setAmount(String(debtToEdit.amount));
        setType(debtToEdit.type || 'Individual');
      }
    }
  }, [debtId, debts, isEditing]);

  const handleSave = () => {
    if (!description || !amount) {
      alert('Por favor, ingresa una descripción y un monto.');
      return;
    }

    const debtData = {
      description,
      amount: parseFloat(amount),
      type,
      isPaid: false,
    };

    if (isEditing) {
      updateDebt({ ...debtData, id: debtId });
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Surface style={styles.surface} elevation={1}>
        <TextInput
          label="Descripción de la deuda"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          testID="description-input"
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          testID="amount-input"
        />

        <Text style={styles.sectionTitle}>Tipo de Deuda</Text>
        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
          <View style={styles.radioContainer}>
            <RadioButton.Item label="Tarjeta" value="Tarjeta" testID="radio-tarjeta" />
            <RadioButton.Item label="Crédito" value="Crédito" testID="radio-credito" />
            <RadioButton.Item label="Persona" value="Persona" testID="radio-persona" />
            <RadioButton.Item label="Individual" value="Individual" testID="radio-individual" />
          </View>
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          testID="save-button"
        >
          {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 20,
    margin: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  radioContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
});

export default DebtFormScreen;
