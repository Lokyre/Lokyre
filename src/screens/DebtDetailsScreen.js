import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt } = useDebts();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handlePay = () => {
    // Para simplificar, "Pagar" eliminará la deuda de la lista activa.
    deleteDebt(debt.id);
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
          <Title>{debt.title}</Title>
          <Paragraph style={styles.amount}>Monto: ${debt.amount}</Paragraph>
          <Paragraph>Categoría: {debt.category}</Paragraph>
          <Paragraph>Vencimiento: {debt.dueDate || 'No especificado'}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="check"
          onPress={handlePay}
          style={[styles.button, styles.payButton]}
        >
          Marcar como Pagada
        </Button>

        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
          style={styles.button}
        >
          Editar Deuda
        </Button>

        <Button
          mode="text"
          icon="delete"
          onPress={handleDelete}
          color="#d32f2f"
          style={styles.button}
        >
          Eliminar Deuda
        </Button>
      </View>
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
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: '#388e3c',
  },
});

export default DebtDetailsScreen;
