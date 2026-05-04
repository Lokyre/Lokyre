import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

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
            deleteDebt(debtId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debtId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{debt.title}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{debt.category}</Text>
        </View>

        {debt.dueDate ? (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value}>{debt.dueDate}</Text>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, debt.isPaid ? styles.paidText : styles.unpaidText]}>
            {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Creada:</Text>
          <Text style={styles.value}>{new Date(debt.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <TouchableOpacity style={[styles.button, styles.payButton]} onPress={handleMarkAsPaid}>
            <Text style={styles.buttonText}>Marcar como Pagada</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Eliminar Deuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  paidText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  unpaidText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
