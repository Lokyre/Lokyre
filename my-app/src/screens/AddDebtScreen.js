import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const AddDebtScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Tarjetas');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const { addDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const handleSave = () => {
    if (!titulo || !monto) {
      alert('Por favor complete título y monto');
      return;
    }

    addDebt({
      titulo,
      monto: parseFloat(monto),
      categoria,
      fecha,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        testID="input-titulo"
      />
      <TextInput
        label="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        style={styles.input}
        testID="input-monto"
      />

      <Text variant="titleMedium" style={styles.label}>Categoría</Text>
      <RadioButton.Group onValueChange={newValue => setCategoria(newValue)} value={categoria}>
        <View style={styles.radioRow}>
          <RadioButton value="Tarjetas" testID="radio-tarjetas" />
          <Text>Tarjetas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Créditos" testID="radio-creditos" />
          <Text>Créditos</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Personas" testID="radio-personas" />
          <Text>Personas</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="Individuales" testID="radio-individuales" />
          <Text>Individuales</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
        testID="input-fecha"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button} testID="btn-save">
        Guardar Deuda
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
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddDebtScreen;
