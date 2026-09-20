import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debts, deleteDebt, markAsPaid } = useDebtContext();
  const { debtId } = route?.params || {};

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigation.goBack();
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Paragraph style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Categoría:</Text>
            <Paragraph style={styles.value}>{debt.category}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Paragraph style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Paragraph>
          </View>
          {debt.dueDate ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vence:</Text>
              <Paragraph style={styles.value}>{debt.dueDate}</Paragraph>
            </View>
          ) : null}
          {debt.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.label}>Notas:</Text>
              <Paragraph>{debt.notes}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          {!debt.isPaid && (
            <Button mode="contained" onPress={handleMarkAsPaid} style={styles.paidButton}>
              Marcar como Pagada
            </Button>
          )}
          <Button mode="outlined" onPress={handleDelete} color="#d32f2f" style={styles.deleteButton}>
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

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
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  notesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actions: {
    flexDirection: 'column',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  paidButton: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    width: '100%',
    borderColor: '#d32f2f',
  },
});
