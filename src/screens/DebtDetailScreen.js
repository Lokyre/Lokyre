import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { debts, updateDebt, deleteDebt } = useDebts();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleToggleStatus = async () => {
    const newStatus = debt.status === 'pending' ? 'paid' : 'pending';
    await updateDebt(debt.id, { status: newStatus });
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro que deseas eliminar esta deuda?',
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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[
              styles.value,
              { color: debt.status === 'paid' ? 'green' : 'red' }
            ]}>
              {debt.status === 'paid' ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Creado el:</Text>
            <Text style={styles.value}>
              {new Date(debt.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          style={styles.button}
          color={debt.status === 'pending' ? '#4CAF50' : '#FF9800'}
          testID="toggle-status-button"
        >
          {debt.status === 'pending' ? 'Marcar como Pagado' : 'Marcar como Pendiente'}
        </Button>
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
          color="#F44336"
          testID="delete-button"
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#F44336',
  }
});
