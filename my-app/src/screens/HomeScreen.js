import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, ActivityIndicator, Appbar, SegmentedButtons } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useDebts();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !debt.isPaid;
    if (filter === 'paid') return debt.isPaid;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            {
              value: 'all',
              label: 'Todas',
            },
            {
              value: 'pending',
              label: 'Pendientes',
            },
            {
              value: 'paid',
              label: 'Pagadas',
            },
          ]}
        />
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
