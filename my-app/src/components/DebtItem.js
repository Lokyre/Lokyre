import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DebtItem({ debt, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.leftContent}>
        <Text style={styles.title} numberOfLines={1}>{debt.title}</Text>
        <Text style={styles.category}>{debt.category}</Text>
        {debt.dueDate ? (
          <Text style={styles.dueDate}>Vence: {debt.dueDate}</Text>
        ) : null}
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>
        <Text style={[styles.status, debt.isPaid ? styles.paid : styles.unpaid]}>
          {debt.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContent: {
    flex: 1,
    marginRight: 10,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  paid: {
    color: '#4CAF50', // Green
  },
  unpaid: {
    color: '#E53935', // Red
  },
});
