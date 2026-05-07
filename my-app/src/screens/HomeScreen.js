import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const activeDebts = debts.filter(d => !d.isPaid);
  const totalDebt = activeDebts.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
    >
      <View>
        <Text style={styles.debtTitle}>{item.title}</Text>
        <Text style={styles.debtCategory}>{item.category}</Text>
      </View>
      <Text style={styles.debtAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Total Pendiente</Text>
        <Text style={styles.headerAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Tus Deudas</Text>
        {activeDebts.length === 0 ? (
          <Text style={styles.emptyText}>No tienes deudas pendientes. ¡Genial!</Text>
        ) : (
          <FlatList
            data={activeDebts}
            keyExtractor={(item) => item.id}
            renderItem={renderDebtItem}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  debtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debtCategory: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
  },
  fabText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
