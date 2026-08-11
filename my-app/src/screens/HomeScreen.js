import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { DebtItem } from '../components/DebtItem';

export const HomeScreen = ({ navigation }) => {
  const { debts, loading, markAsPaid } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pendingDebts = debts.filter(d => !d.isPaid);
  const totalPending = pendingDebts.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Pendiente</Text>
          <Text variant="headlineLarge" style={styles.totalAmount}>
            ${totalPending.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.listTitle}>
        Deudas Pendientes
      </Text>

      <FlatList
        data={pendingDebts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtItem
            debt={item}
            onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
            onMarkAsPaid={markAsPaid}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#e3f2fd',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#1976d2',
    marginTop: 8,
  },
  listTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
