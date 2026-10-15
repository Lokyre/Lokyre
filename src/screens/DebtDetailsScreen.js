import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useDebt } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailsScreen() {
  const { debts, markAsPaid, removeDebt } = useDebt();
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};
  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centerContainer}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    removeDebt(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{debt.description}</Title>
          <Paragraph style={styles.detailText}>
            <Text style={styles.label}>Cantidad:</Text> ${debt.amount.toFixed(2)}
          </Paragraph>
          <Paragraph style={styles.detailText}>
            <Text style={styles.label}>Categoría:</Text> {debt.category}
          </Paragraph>
          <Paragraph style={styles.detailText}>
            <Text style={styles.label}>Fecha:</Text> {new Date(debt.date).toLocaleDateString()}
          </Paragraph>
          <Paragraph style={[styles.detailText, debt.isPaid ? styles.paidStatus : styles.pendingStatus]}>
            <Text style={styles.label}>Estado:</Text> {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={[styles.button, styles.paidButton]}
            icon="check"
          >
            Marcar como Pagado
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
          buttonColor="#d32f2f"
          icon="delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  actions: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  paidButton: {
    backgroundColor: '#388e3c',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  paidStatus: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});
