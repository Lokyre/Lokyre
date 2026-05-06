import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, removeDebt, markAsPaid } = useContext(DebtContext);

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
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
      markAsPaid(debt.id);
      Alert.alert('Éxito', 'La deuda ha sido marcada como pagada.');
      navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{debt.title}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{debt.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Vencimiento:</Text>
          <Text style={styles.value}>{debt.dueDate || 'No especificado'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
        </View>

        {debt.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.label}>Notas:</Text>
            <Text style={styles.notesText}>{debt.notes}</Text>
          </View>
        ) : null}
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
    </ScrollView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  notesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  notesText: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
    lineHeight: 22,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: '#2ecc71',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebtDetailsScreen;
