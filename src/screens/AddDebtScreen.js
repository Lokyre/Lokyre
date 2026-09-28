import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const DEBT_TYPES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const AddDebtScreen = () => {
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState(DEBT_TYPES[0]);

  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const handleSave = () => {
    if (!concepto.trim() || !monto.trim() || isNaN(parseFloat(monto))) {
      // In a real app we might show a Snackbar or Alert here
      return;
    }

    addDebt(concepto, monto, tipo);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nueva Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          label="Concepto"
          value={concepto}
          onChangeText={setConcepto}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto"
          value={monto}
          onChangeText={setMonto}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Affix text="$" />}
        />

        <View style={styles.radioGroupContainer}>
          <Text variant="titleMedium" style={styles.radioLabel}>Tipo de Deuda</Text>
          <RadioButton.Group onValueChange={value => setTipo(value)} value={tipo}>
            {DEBT_TYPES.map(type => (
              <RadioButton.Item
                key={type}
                label={type}
                value={type}
                mode="android"
              />
            ))}
          </RadioButton.Group>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          disabled={!concepto.trim() || !monto.trim()}
        >
          Guardar Deuda
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  radioGroupContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  radioLabel: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  }
});

export default AddDebtScreen;
