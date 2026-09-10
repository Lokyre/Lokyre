import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Divider, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { getDebtById, toggleDebtPayment, deleteDebt } = useDebts();

  const debt = getDebtById(debtId);

  if (!debt) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se encontró la deuda.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleTogglePayment = () => {
    toggleDebtPayment(debt.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>{debt.title}</Text>
            {debt.isPaid ? (
              <Chip icon="check" style={styles.paidChip}>Pagado</Chip>
            ) : (
              <Chip icon="clock-outline" style={styles.pendingChip}>Pendiente</Chip>
            )}
          </View>

          <Text variant="headlineMedium" style={styles.amount}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="titleMedium">Tipo:</Text>
            <Text variant="bodyLarge">{debt.type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="titleMedium">Fecha:</Text>
            <Text variant="bodyLarge">{new Date(debt.date).toLocaleDateString()}</Text>
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.descriptionTitle}>Descripción:</Text>
          <Text variant="bodyLarge" style={styles.description}>
            {debt.description || "Sin descripción."}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleTogglePayment}
          style={[styles.button, debt.isPaid ? styles.unpayButton : styles.payButton]}
          icon={debt.isPaid ? "close" : "check"}
        >
          {debt.isPaid ? "Marcar como Pendiente" : "Marcar como Pagado"}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="#d32f2f"
          style={styles.deleteButton}
          icon="delete"
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
  paidChip: {
    backgroundColor: '#e8f5e9',
  },
  pendingChip: {
    backgroundColor: '#fff3e0',
  },
  amount: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descriptionTitle: {
    marginBottom: 8,
  },
  description: {
    color: '#666',
  },
  actionButtons: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  payButton: {
    backgroundColor: '#4caf50',
  },
  unpayButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    borderColor: '#d32f2f',
    paddingVertical: 8,
  },
});
