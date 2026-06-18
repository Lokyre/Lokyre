import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge">Deuda no encontrada</Text>
      </View>
    );
  }

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
            deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
        <Card.Content>
          <Text variant="titleLarge" style={styles.amount}>
            Monto: ${parseFloat(debt.amount).toFixed(2)}
          </Text>
          <Text variant="bodyMedium" style={styles.detail}>
            Vencimiento: {debt.dueDate}
          </Text>
          <Text variant="bodyMedium" style={styles.detail}>
            Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
          {debt.description ? (
            <Text variant="bodyMedium" style={styles.detail}>
              Descripción: {debt.description}
            </Text>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.button}
            buttonColor="#388e3c"
            testID="btn-mark-paid"
          >
            Marcar como Pagado
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#d32f2f"
          testID="btn-delete"
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
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  amount: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  detail: {
    marginBottom: 5,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default DebtDetailScreen;
