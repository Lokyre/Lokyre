import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handlePay = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>Monto: ${debt.amount}</Paragraph>
          <Paragraph style={styles.detail}>Categoría: {debt.category}</Paragraph>
          <Paragraph style={styles.detail}>Fecha: {new Date(debt.date).toLocaleDateString()}</Paragraph>
          <Paragraph style={styles.detail}>Estado: {debt.status === 'pending' ? 'Pendiente' : 'Pagado'}</Paragraph>
          {debt.notes ? <Paragraph style={styles.detail}>Notas: {debt.notes}</Paragraph> : null}
        </Card.Content>
      </Card>

      {debt.status === 'pending' && (
        <Button mode="contained" onPress={handlePay} style={[styles.button, styles.payButton]}>
          Marcar como Pagado
        </Button>
      )}

      <Button mode="outlined" onPress={handleDelete} style={[styles.button, styles.deleteButton]} color="#d32f2f">
        Eliminar Deuda
      </Button>
    </View>
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
    fontSize: 24,
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
    padding: 8,
  },
  payButton: {
    backgroundColor: '#388e3c',
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
});

export default DebtDetailScreen;
