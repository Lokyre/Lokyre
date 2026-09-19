import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Title, Button, Card, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ navigation, route }) {
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
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
          <Title>{debt.description}</Title>
          <Paragraph style={styles.detail}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph style={styles.detail}>Categoría: {debt.category}</Paragraph>
          <Paragraph style={styles.detail}>Estado: {debt.paid ? 'Pagado' : 'Pendiente'}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })} testID="btn-edit">
            Editar
          </Button>
          {!debt.paid && (
            <Button onPress={handleMarkAsPaid} testID="btn-mark-paid">
              Marcar Pagado
            </Button>
          )}
          <Button onPress={handleDelete} color="red" testID="btn-delete">
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
    padding: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
  actions: {
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
});
