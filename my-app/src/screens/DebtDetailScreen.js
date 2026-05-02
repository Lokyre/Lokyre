import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Marcar como pagado',
      '¿Estás seguro de que deseas marcar esta deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            markAsPaid(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda de forma permanente?',
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{debt.name}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{debt.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={debt.isPaid ? styles.statusPaid : styles.statusPending}>
            {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        </View>

        {debt.dueDate ? (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value}>{debt.dueDate}</Text>
          </View>
        ) : null}

        {debt.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.description}>{debt.description}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        {!debt.isPaid && (
          <TouchableOpacity style={styles.payButton} onPress={handleMarkAsPaid}>
            <Text style={styles.buttonText}>Marcar como Pagado</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Eliminar Deuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusPending: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  statusPaid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  descriptionContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 10,
  },
  payButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebtDetailScreen;
