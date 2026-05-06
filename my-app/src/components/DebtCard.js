import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DebtCard = ({ debt, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerInfo}>
        <Text style={styles.title}>{debt.title}</Text>
        <Text style={[styles.amount, { color: debt.isPaid ? 'green' : 'red' }]}>
          ${parseFloat(debt.amount).toFixed(2)}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.category}>{debt.category}</Text>
        <Text style={styles.date}>Vence: {debt.dueDate}</Text>
      </View>
      <View style={styles.statusContainer}>
         <Text style={styles.statusText}>{debt.isPaid ? 'Pagada' : 'Pendiente'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  statusContainer: {
      alignItems: 'flex-start',
  },
  statusText: {
      fontSize: 12,
      fontStyle: 'italic',
      color: '#555'
  }
});

export default DebtCard;
