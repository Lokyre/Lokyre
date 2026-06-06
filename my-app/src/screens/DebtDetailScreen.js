import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteDebt(id);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('AddEditDebt', { id });
  };

  const handleToggleStatus = () => {
    toggleDebtStatus(id);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>{debt.title}</Text>
          <Text variant="titleMedium" style={styles.detailText}>Monto: ${debt.amount}</Text>
          <Text variant="titleMedium" style={styles.detailText}>Tipo: {debt.type}</Text>
          <Text variant="titleMedium" style={styles.detailText}>Vencimiento: {debt.dueDate}</Text>
          <Text variant="titleMedium" style={styles.detailText}>Descripción:</Text>
          <Text variant="bodyMedium" style={styles.description}>{debt.description}</Text>
          <Text variant="titleMedium" style={[styles.detailText, { color: debt.isPaid ? 'green' : 'red' }]}>
            Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleToggleStatus} style={styles.button}>
          Marcar como {debt.isPaid ? 'Pendiente' : 'Pagado'}
        </Button>
        <Button mode="outlined" onPress={handleEdit} style={styles.button}>
          Editar Deuda
        </Button>
        <Button mode="contained" buttonColor="red" onPress={handleDelete} style={styles.button}>
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  detailText: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
