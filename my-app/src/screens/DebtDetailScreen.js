import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { markAsPaid, deleteDebt } = useContext(DebtContext);

  const handleMarkAsPaid = () => {
    Alert.alert('Confirm', 'Are you sure you want to mark this debt as paid?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          markAsPaid(debt.id);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this debt?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDebt(debt.id);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{debt.name}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{debt.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, debt.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
            {debt.status.toUpperCase()}
          </Text>
        </View>

        {debt.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.descriptionText}>{debt.description}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AddEditDebt', { debt })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        {debt.status === 'pending' && (
          <TouchableOpacity
            style={[styles.button, styles.payButton]}
            onPress={handleMarkAsPaid}
          >
            <Text style={styles.buttonText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e88e5',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  statusPending: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  statusPaid: {
    color: '#43a047',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  actions: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#1e88e5',
  },
  payButton: {
    backgroundColor: '#43a047',
  },
  deleteButton: {
    backgroundColor: '#e53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebtDetailScreen;
