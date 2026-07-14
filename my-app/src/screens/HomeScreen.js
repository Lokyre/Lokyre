import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'paid'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'pending') return !debt.isPaid;
    if (filter === 'paid') return debt.isPaid;
    return true; // 'all'
  });

  const totalPendingAmount = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debt: item })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title testID={`debt-title-${item.id}`}>{item.title}</Title>
          <Text style={[styles.amount, { color: item.isPaid ? 'green' : 'red' }]}>
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <Chip icon="tag" style={styles.chip}>{item.type}</Chip>
          {item.isPaid ? (
            <Chip icon="check-circle" style={styles.chipPaid}>Pagada</Chip>
          ) : (
            <Chip icon="clock-outline" style={styles.chipPending}>Pendiente</Chip>
          )}
        </View>
        <Paragraph>Vence: {item.dueDate}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Total Pendiente</Text>
        <Text style={styles.headerAmount}>${totalPendingAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.filters}>
        <Button
          mode={filter === 'pending' ? 'contained' : 'outlined'}
          onPress={() => setFilter('pending')}
          style={styles.filterButton}
        >
          Pendientes
        </Button>
        <Button
          mode={filter === 'paid' ? 'contained' : 'outlined'}
          onPress={() => setFilter('paid')}
          style={styles.filterButton}
        >
          Pagadas
        </Button>
        <Button
          mode={filter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setFilter('all')}
          style={styles.filterButton}
        >
          Todas
        </Button>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas para mostrar</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

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
  headerAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 5,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    marginRight: 10,
  },
  chipPaid: {
    backgroundColor: '#c8e6c9',
  },
  chipPending: {
    backgroundColor: '#ffcdd2',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
