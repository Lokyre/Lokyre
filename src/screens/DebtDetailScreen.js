import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Paragraph, Button, TextInput, Card, Text, Divider, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

export default function DebtDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { debtId } = route.params;
  const { debts, addPayment, deleteDebt } = useContext(DebtContext);

  const [paymentAmount, setPaymentAmount] = useState('');

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const pendingAmount = debt.totalAmount - (debt.totalPaid || 0);

  const handleAddPayment = () => {
    const parsedAmount = parseFloat(paymentAmount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0.');
      return;
    }

    if (parsedAmount > pendingAmount) {
      Alert.alert('Error', 'El pago no puede ser mayor a la deuda pendiente.');
      return;
    }

    const newPayment = {
      id: uuidv4(),
      amount: parsedAmount,
      date: new Date().toISOString()
    };

    addPayment(debt.id, newPayment);
    setPaymentAmount('');
    Alert.alert('Éxito', 'Pago registrado correctamente.');
  };

  const handlePayFull = () => {
    if (pendingAmount <= 0) return;

    Alert.alert(
      'Confirmar Pago Total',
      `¿Estás seguro de liquidar el saldo pendiente de $${pendingAmount.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Liquidar',
          onPress: () => {
            const newPayment = {
              id: uuidv4(),
              amount: pendingAmount,
              date: new Date().toISOString()
            };
            addPayment(debt.id, newPayment);
            Alert.alert('Éxito', 'Deuda liquidada completamente.');
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro que deseas eliminar esta deuda de tus registros? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.titleRow}>
            <Title style={styles.title}>{debt.title}</Title>
            <IconButton icon="delete" iconColor="red" size={24} onPress={handleDelete} />
          </View>
          <Paragraph style={styles.categoryText}>Categoría: {debt.category}</Paragraph>
          <Paragraph>Vencimiento: {new Date(debt.dueDate).toLocaleDateString()}</Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>${debt.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pagado</Text>
              <Text style={[styles.statValue, { color: 'green' }]}>${(debt.totalPaid || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pendiente</Text>
              <Text style={[styles.statValue, { color: pendingAmount > 0 ? 'red' : 'gray' }]}>
                ${pendingAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: debt.status === 'pagado' ? 'green' : 'orange' }]}>
              ESTADO: {debt.status.toUpperCase()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {debt.status !== 'pagado' && (
        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Registrar Pago</Title>
            <View style={styles.paymentRow}>
              <TextInput
                label="Monto"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="numeric"
                style={styles.paymentInput}
                mode="outlined"
              />
              <Button mode="contained" onPress={handleAddPayment} style={styles.paymentButton}>
                Pagar
              </Button>
            </View>

            <Button
              mode="outlined"
              onPress={handlePayFull}
              style={styles.fullPayButton}
              color="green"
            >
              Liquidar Totalidad (${pendingAmount.toFixed(2)})
            </Button>
          </Card.Content>
        </Card>
      )}

      <Title style={styles.historyTitle}>Historial de Pagos</Title>
      {(!debt.payments || debt.payments.length === 0) ? (
        <Text style={styles.noPaymentsText}>No hay pagos registrados.</Text>
      ) : (
        debt.payments.map(payment => (
          <Card key={payment.id} style={styles.historyCard}>
            <Card.Content style={styles.historyCardContent}>
              <Text>{new Date(payment.date).toLocaleDateString()}</Text>
              <Text style={styles.historyAmount}>+ ${payment.amount.toFixed(2)}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  headerCard: {
    marginBottom: 20,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  categoryText: {
    textTransform: 'capitalize',
    color: '#666',
  },
  divider: {
    marginVertical: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusBadge: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionCard: {
    marginBottom: 20,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentInput: {
    flex: 1,
    marginRight: 10,
  },
  paymentButton: {
    justifyContent: 'center',
  },
  fullPayButton: {
    marginTop: 15,
    borderColor: 'green',
  },
  historyTitle: {
    marginBottom: 10,
  },
  noPaymentsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
  },
  historyCard: {
    marginBottom: 10,
  },
  historyCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyAmount: {
    color: 'green',
    fontWeight: 'bold',
  },
});
