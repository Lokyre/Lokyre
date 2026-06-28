import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, deleteDebt, togglePaidStatus } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleTogglePaid = async () => {
    await togglePaidStatus(debt.id);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
        <Card.Content>
          <View style={styles.detailRow}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="bodyLarge">${debt.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Estado:</Text>
            <Text
              variant="bodyLarge"
              style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.detailRow}>
              <Text variant="titleMedium">Vencimiento:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.detailRow}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyLarge">{debt.description}</Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={styles.button}
          buttonColor={debt.isPaid ? '#ff9800' : '#4caf50'}
          testID="btn-toggle-paid"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#f44336"
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </View>
  );
}

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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
  },
});
