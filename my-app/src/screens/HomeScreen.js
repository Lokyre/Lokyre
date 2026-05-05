import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalPending = debts
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const totalPaid = debts
    .filter(d => d.status === 'paid')
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status === 'paid' ? styles.itemPaid : null]}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={[styles.itemStatus, item.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Pending</Text>
          <Text style={styles.summaryPending}>${totalPending.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryPaid}>${totalPaid.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Debts</Text>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No debts found. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryPending: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53935',
  },
  summaryPaid: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43a047',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e53935',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemPaid: {
    borderLeftColor: '#43a047',
    opacity: 0.8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemType: {
    color: '#666',
    fontSize: 14,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusPending: {
    color: '#e53935',
  },
  statusPaid: {
    color: '#43a047',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#1e88e5',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default HomeScreen;
