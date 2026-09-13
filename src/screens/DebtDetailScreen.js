import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, markAsPaid, deleteDebt } = useDebtContext();
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
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
      <Title style={styles.title}>{debt.description}</Title>
      <Paragraph style={styles.detail}>Monto: <Text style={styles.bold}>${debt.amount.toFixed(2)}</Text></Paragraph>
      <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
      {debt.dueDate ? <Paragraph style={styles.detail}>Vencimiento: {debt.dueDate}</Paragraph> : null}
      <Paragraph style={styles.detail}>Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button mode="contained" onPress={handlePay} style={styles.button} testID="btn-pay">
            Marcar como Pagada
          </Button>
        )}
        <Button mode="outlined" color="#b00020" onPress={handleDelete} style={styles.button} testID="btn-delete">
          Eliminar Deuda
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 32,
  },
  button: {
    marginBottom: 16,
  },
});

export default DebtDetailScreen;
