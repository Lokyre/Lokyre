import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Title, Paragraph, Button, TextInput, Card, useTheme, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;
  const { updateDebt, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const [paymentAmount, setPaymentAmount] = useState('');

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Ingrese un monto válido.');
      return;
    }

    const newPaidAmount = debt.paidAmount + amount;
    const isNowPaid = newPaidAmount >= debt.amount;

    updateDebt(debt.id, {
      paidAmount: isNowPaid ? debt.amount : newPaidAmount,
      isPaid: isNowPaid
    });

    setPaymentAmount('');
    if (isNowPaid) {
      Alert.alert('¡Felicidades!', 'Has terminado de pagar esta deuda.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
        // Actualizamos localmente para reflejar el cambio inmediato en la vista sin salir
        debt.paidAmount = newPaidAmount;
    }
  };

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de marcar toda la deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, pagada',
          onPress: () => {
            updateDebt(debt.id, { paidAmount: debt.amount, isPaid: true });
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda? Esta acción no se puede deshacer.',
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

  const pendingAmount = debt.amount - debt.paidAmount;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.typeText}>Tipo: {debt.type}</Paragraph>
          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total</Text>
              <Text style={styles.amountValue}>${debt.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Pagado</Text>
              <Text style={[styles.amountValue, { color: '#4caf50' }]}>${debt.paidAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Restante</Text>
              <Text style={[styles.amountValue, { color: '#d32f2f' }]}>${Math.max(0, pendingAmount).toFixed(2)}</Text>
            </View>
          </View>
          <Paragraph style={styles.dateText}>
            Fecha de creación: {new Date(debt.createdAt).toLocaleDateString()}
          </Paragraph>
          <Paragraph style={styles.dateText}>
            Vencimiento: {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'No especificado'}
          </Paragraph>
          {debt.isPaid && <Text style={styles.paidBadge}>DEUDA PAGADA TOTALMENTE</Text>}
        </Card.Content>
      </Card>

      {!debt.isPaid && (
        <View style={styles.actionSection}>
          <Title style={styles.sectionTitle}>Abonar a la deuda</Title>
          <TextInput
            label="Monto a abonar"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddPayment}
            style={styles.button}
            buttonColor={theme.colors.primary}
          >
            Registrar Abono
          </Button>

          <Button
            mode="outlined"
            onPress={handleMarkAsPaid}
            style={[styles.button, styles.markPaidButton]}
            textColor="#4caf50"
          >
            Marcar todo como Pagado
          </Button>
        </View>
      )}

      <Button
        mode="text"
        onPress={handleDelete}
        textColor="#d32f2f"
        style={styles.deleteButton}
      >
        Eliminar Deuda
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  amountBox: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  paidBadge: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  markPaidButton: {
    borderColor: '#4caf50',
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 40,
  }
});
