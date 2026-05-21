import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, List } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);
  const [paymentAmount, setPaymentAmount] = useState('');

  const debt = debts.find(d => d.id === id);

  if (!debt) return null;

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Ingrese un monto válido');
      return;
    }

    if (amount > debt.remainingAmount) {
      alert('El pago no puede ser mayor que el monto restante');
      return;
    }

    const updatedDebt = {
      ...debt,
      remainingAmount: debt.remainingAmount - amount,
      payments: [...debt.payments, { date: new Date().toISOString().split('T')[0], amount }]
    };

    updateDebt(updatedDebt);
    setPaymentAmount('');
  };

  const handleDelete = () => {
    deleteDebt(id);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{debt.name}</Text>
          <Text variant="bodyMedium">Tipo: {debt.type}</Text>
          <Text variant="bodyMedium">Vencimiento: {debt.dueDate}</Text>
          <Text variant="headlineSmall" style={styles.amount}>Restante: ${debt.remainingAmount.toFixed(2)}</Text>
          <Text variant="bodyMedium">Total Original: ${debt.totalAmount.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Registrar Pago</Text>
          <TextInput
            label="Monto del pago"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <Button mode="contained" onPress={handlePayment} style={styles.button}>
            Realizar Pago
          </Button>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>Historial de Pagos</Text>
      {debt.payments.length === 0 ? (
        <Text style={styles.emptyText}>No hay pagos registrados.</Text>
      ) : (
        debt.payments.map((p, index) => (
          <List.Item
            key={index}
            title={`Pago el ${p.date}`}
            right={props => <Text {...props} style={styles.paymentAmount}>+${p.amount.toFixed(2)}</Text>}
          />
        ))
      )}

      <Button
        mode="outlined"
        buttonColor="#ffebee"
        textColor="#d32f2f"
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        Eliminar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  amount: {
    marginTop: 8,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 4,
  },
  deleteButton: {
    marginTop: 24,
    marginBottom: 32,
    borderColor: '#d32f2f',
  },
  emptyText: {
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  paymentAmount: {
    color: '#388e3c',
    fontWeight: 'bold',
    alignSelf: 'center',
  }
});

export default DebtDetailScreen;
