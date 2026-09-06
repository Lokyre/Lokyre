import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, FAB, Text, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

export default function HomeScreen({ navigation }) {
  const { debts, isLoaded } = useDebts();

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalAmount = debts.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  const totalPaid = debts.reduce((sum, d) => {
    const paid = (d.payments || []).reduce((pSum, p) => pSum + (parseFloat(p.amount) || 0), 0);
    return sum + paid;
  }, 0);
  const totalPending = Math.max(0, totalAmount - totalPaid);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Total Pendiente</Title>
        <Text style={styles.headerAmount}>${totalPending.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DebtCard debt={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#666',
  },
  headerAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});
