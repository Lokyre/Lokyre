import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const AddDebtScreen = ({ route, navigation }) => {
  const { addDebt, updateDebt, debts } = useContext(DebtContext);
  const theme = useTheme();

  const isEditing = route.params?.debtId;
  const debtToEdit = isEditing ? debts.find(d => d.id === route.params.debtId) : null;

  const [title, setTitle] = useState(debtToEdit ? debtToEdit.title : '');
  const [amount, setAmount] = useState(debtToEdit ? debtToEdit.amount.toString() : '');
  const [category, setCategory] = useState(debtToEdit ? debtToEdit.category : 'Tarjetas');
  const [description, setDescription] = useState(debtToEdit ? debtToEdit.description : '');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Deuda' : 'Nueva Deuda'
    });
  }, [navigation, isEditing]);

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor, completa el título y el monto.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
        Alert.alert('Error', 'El monto debe ser un número válido.');
        return;
    }

    const debtData = {
      title,
      amount,
      category,
      description,
    };

    if (isEditing) {
      updateDebt(route.params.debtId, debtData);
    } else {
      addDebt(debtData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título (Ej. Tarjeta VISA, Préstamo Auto)"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Monto Pendiente"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Affix text="$" />}
          style={styles.input}
        />

        <Text style={styles.label}>Categoría</Text>
        <SegmentedButtons
          value={category}
          onValueChange={setCategory}
          buttons={[
            { value: 'Tarjetas', label: 'Tarjetas', icon: 'credit-card' },
            { value: 'Créditos', label: 'Créditos', icon: 'bank' },
            { value: 'Personas', label: 'Personas', icon: 'account-group' },
            { value: 'Individuales', label: 'Indiv.', icon: 'account' },
          ]}
          style={styles.segmentedButton}
        />

        <TextInput
          label="Descripción Adicional (Opcional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          buttonColor={theme.colors.primary}
        >
          {isEditing ? 'Actualizar Deuda' : 'Guardar Deuda'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '500',
  },
  segmentedButton: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 6,
  }
});

export default AddDebtScreen;
