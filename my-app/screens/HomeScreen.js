import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [debts, setDebts] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0);

  const loadDebts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@debts');
      const storedDebts = jsonValue != null ? JSON.parse(jsonValue) : [];
      setDebts(storedDebts);

      const total = storedDebts
        .filter(d => d.status !== 'paid')
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);
      setTotalDebt(total);
    } catch (e) {
      console.error('Error loading debts', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDebts();
    }, [])
  );

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.debtItem, item.status === 'paid' && styles.paidDebtItem]}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
    >
      <View style={styles.debtInfo}>
        <Text style={styles.debtName}>{item.name}</Text>
        <Text style={styles.debtType}>{item.type}</Text>
      </View>
      <View style={styles.debtAmountContainer}>
        <Text style={styles.debtAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
        {item.status === 'paid' && <Text style={styles.paidText}>Pagado</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Total Pendiente</Text>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderDebtItem}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  debtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paidDebtItem: {
    opacity: 0.6,
  },
  debtInfo: {
    flex: 1,
  },
  debtName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  debtType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  debtAmountContainer: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paidText: {
    fontSize: 12,
    color: '#388e3c',
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
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
  fabIcon: {
    fontSize: 30,
    color: 'white',
  }
});
