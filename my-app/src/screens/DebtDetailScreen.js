import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, TextInput, ProgressBar, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, addPayment, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find((d) => d.id === id);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const progress = debt.amount > 0 ? debt.paidAmount / debt.amount : 0;
  const isPaid = progress >= 1;

  const handleAddPayment = () => {
    if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
      alert('Por favor, ingresa un monto de pago válido.');
      return;
    }
    addPayment(id, paymentAmount);
    setPaymentAmount('');
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Text style={styles.category}>{debt.category}</Text>

          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total a Pagar</Text>
              <Text style={styles.amountValue}>${debt.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Pagado</Text>
              <Text style={[styles.amountValue, { color: 'green' }]}>${debt.paidAmount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progreso: {(progress * 100).toFixed(0)}%</Text>
            <ProgressBar
              progress={progress > 1 ? 1 : progress}
              color={isPaid ? 'green' : theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {!isPaid && (
        <Card style={styles.paymentCard}>
          <Card.Content>
            <Title>Añadir Pago</Title>
            <TextInput
              label="Monto del pago"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            <Button mode="contained" onPress={handleAddPayment}>
              Registrar Pago
            </Button>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="outlined"
        buttonColor="#ffe6e6"
        textColor="red"
        style={styles.deleteButton}
        onPress={handleDelete}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
  },
  category: {
    color: '#666',
    marginBottom: 16,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountBox: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    textAlign: 'right',
    marginBottom: 4,
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  paymentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 32,
    borderColor: 'red',
  },
});

export default DebtDetailScreen;
