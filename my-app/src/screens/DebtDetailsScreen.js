import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, Card } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, toggleDebtPaid, deleteDebt } = useDebtContext();

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleToggleStatus = () => {
    toggleDebtPaid(debt.id);
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
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <Title style={styles.amount}>Monto: ${debt.amount}</Title>
          <Paragraph style={styles.detailText}>
            Estado: <Text style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </Paragraph>
          <Paragraph style={styles.detailText}>Vencimiento: {debt.dueDate || 'N/A'}</Paragraph>
          {debt.description ? (
            <Paragraph style={styles.detailText}>Descripción: {debt.description}</Paragraph>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          style={[styles.button, debt.isPaid ? styles.btnPending : styles.btnPaid]}
          testID="btn-toggle-status"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>
        <Button
          mode="outlined"
          color="red"
          onPress={handleDelete}
          style={styles.button}
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
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
    marginBottom: 20,
  },
  amount: {
    fontSize: 22,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  btnPaid: {
    backgroundColor: '#4caf50',
  },
  btnPending: {
    backgroundColor: '#ff9800',
  },
});

export default DebtDetailsScreen;
