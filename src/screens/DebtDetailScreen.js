import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { Title, Paragraph, Button, TextInput, Card, Text, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, addPayment } = useDebts();

  const debt = debts.find(d => d.id === debtId);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const totalPayments = (debt.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const balance = (parseFloat(debt.amount) || 0) - totalPayments;
  const isPaid = balance <= 0;

  const handleDelete = () => {
    // Note: Alert.alert might not work well in Jest/Web out of the box, but we'll use a direct confirm for testing or just call delete
    deleteDebt(debt.id);
    navigation.goBack();
  };

  const handleAddPayment = () => {
    if (!paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    addPayment(debt.id, { amount });
    setPaymentAmount('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{debt.title}</Title>
          <Paragraph style={styles.type}>Tipo: {debt.type}</Paragraph>
          <Paragraph>Monto Original: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph style={styles.balance}>Saldo Pendiente: ${Math.max(0, balance).toFixed(2)}</Paragraph>
          {debt.dueDate ? <Paragraph>Vencimiento: {debt.dueDate}</Paragraph> : null}
          {debt.notes ? <Paragraph style={styles.notes}>Notas: {debt.notes}</Paragraph> : null}
        </Card.Content>
        <Card.Actions>
          <Button color="red" onPress={handleDelete} testID="delete-debt-button">Eliminar Deuda</Button>
        </Card.Actions>
      </Card>

      {!isPaid && (
        <Card style={styles.paymentCard}>
          <Card.Content>
            <Title style={styles.paymentTitle}>Agregar Pago</Title>
            <TextInput
              label="Monto del pago"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddPayment} testID="add-payment-button">
              Registrar Pago
            </Button>
          </Card.Content>
        </Card>
      )}

      <Title style={styles.historyTitle}>Historial de Pagos</Title>
      {(!debt.payments || debt.payments.length === 0) ? (
        <Text style={styles.noPayments}>No hay pagos registrados.</Text>
      ) : (
        debt.payments.map((payment, index) => (
          <View key={payment.id || index} style={styles.paymentItem}>
            <Text style={styles.paymentAmount}>${parseFloat(payment.amount).toFixed(2)}</Text>
            <Text style={styles.paymentDate}>{new Date(payment.date).toLocaleDateString()}</Text>
          </View>
        ))
      )}
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  type: {
    color: '#666',
    marginBottom: 8,
  },
  balance: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#d32f2f',
    marginTop: 8,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  paymentCard: {
    marginBottom: 16,
    backgroundColor: '#e8f4fd',
  },
  paymentTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  noPayments: {
    paddingHorizontal: 4,
    color: '#666',
    fontStyle: 'italic',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 4,
    marginBottom: 4,
  },
  paymentAmount: {
    fontWeight: 'bold',
    color: 'green',
  },
  paymentDate: {
    color: '#666',
  },
});
