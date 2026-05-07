import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { markAsPaid, deleteDebt } = useContext(DebtContext);

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Marcar como Pagada',
      '¿Estás seguro de que deseas marcar esta deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Pagada',
          onPress: () => {
            markAsPaid(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda permanentemente?',
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{debt.title}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Categoría:</Text>
          <Text style={styles.detailValue}>{debt.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Estado:</Text>
          <Text style={[styles.detailValue, { color: debt.isPaid ? 'green' : 'red' }]}>
            {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Creada el:</Text>
          <Text style={styles.detailValue}>
            {new Date(debt.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {!debt.isPaid && (
        <TouchableOpacity style={styles.payButton} onPress={handleMarkAsPaid}>
          <Text style={styles.buttonText}>Marcar como Pagada</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar Deuda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: 'gray',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebtDetailScreen;
