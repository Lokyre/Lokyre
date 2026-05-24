import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function AddDebtScreen() {
  const { addDebt } = useDebtContext();
  const navigation = useNavigation();

  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Individual');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!concept.trim() || !amount.trim() || isNaN(amount)) {
      alert('Por favor, ingresa un concepto válido y un monto numérico.');
      return;
    }

    addDebt({
      concept,
      amount: parseFloat(amount),
      type,
      date,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Concepto de la deuda</Text>
      <TextInput
        mode="outlined"
        placeholder="Ej. Compra súper, Préstamo a Juan"
        value={concept}
        onChangeText={setConcept}
        style={styles.input}
      />

      <Text style={styles.label}>Monto</Text>
      <TextInput
        mode="outlined"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Affix text="$" />}
      />

      <Text style={styles.label}>Tipo de deuda</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'Tarjeta', label: 'Tarjeta' },
          { value: 'Crédito', label: 'Crédito' },
          { value: 'Persona', label: 'Persona' },
          { value: 'Individual', label: 'Individual' },
        ]}
        style={styles.segmented}
      />

      <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput
        mode="outlined"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
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
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    marginBottom: 12,
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
});
