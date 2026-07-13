import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, Text, Card, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);
  const [filter, setFilter] = useState('all'); // 'all', 'unpaid', 'paid'

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter((debt) => {
    if (filter === 'unpaid') return !debt.isPaid;
    if (filter === 'paid') return debt.isPaid;
    return true;
  });

  const totalOwed = filteredDebts
    .filter(d => !d.isPaid)
    .reduce((sum, current) => sum + parseFloat(current.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-item-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate}`}
        testID={`debt-title-${item.id}`}
      />
      <Card.Content>
        <Text variant="titleMedium" style={{ color: item.isPaid ? 'green' : 'red' }}>
          ${parseFloat(item.amount).toFixed(2)} {item.isPaid ? '(Pagado)' : '(Pendiente)'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge">Total Pendiente</Text>
          <Text variant="displaySmall" style={{ color: 'red' }}>
            ${totalOwed.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'Todas' },
          { value: 'unpaid', label: 'Pendientes' },
          { value: 'paid', label: 'Pagadas' },
        ]}
        style={styles.segment}
      />

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas para mostrar.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab"
      />
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
  summaryCard: {
    margin: 16,
  },
  segment: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});

export default HomeScreen;
