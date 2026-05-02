import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, getTotalOwed, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.debtItem, item.isPaid && styles.paidItem]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <View style={styles.debtItemHeader}>
        <Text style={styles.debtName}>{item.name}</Text>
        <Text style={styles.debtAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
      </View>
      <View style={styles.debtItemFooter}>
        <Text style={styles.debtCategory}>{item.category}</Text>
        <Text style={item.isPaid ? styles.statusPaid : styles.statusPending}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total a Pagar</Text>
        <Text style={styles.summaryAmount}>${getTotalOwed().toFixed(2)}</Text>
      </View>

      <Text style={styles.listTitle}>Mis Deudas</Text>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderDebtItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  debtItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paidItem: {
    borderLeftColor: '#4caf50',
    opacity: 0.7,
  },
  debtItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  debtName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debtItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debtCategory: {
    color: '#666',
    fontSize: 14,
  },
  statusPending: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  statusPaid: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;
