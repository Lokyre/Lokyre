import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { DebtContext } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const renderItem = ({ item }) => (
    <DebtCard
      debt={item}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    />
  );

  const totalPending = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0)
    .toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Pendiente:</Text>
        <Text style={styles.summaryAmount}>${totalPending}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 50,
      color: '#888',
      fontSize: 16
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
});

export default HomeScreen;
