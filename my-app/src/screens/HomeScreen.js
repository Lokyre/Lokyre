import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip, ActivityIndicator, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebts();
  const [filter, setFilter] = useState('Todas'); // Todas, Pendientes, Pagadas

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'Pendientes') return !debt.isPaid;
    if (filter === 'Pagadas') return debt.isPaid;
    return true;
  });

  const totalPending = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`$${item.amount} - ${item.type}`}
      />
      <Card.Content>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'} - Vence: {item.dueDate}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="titleMedium">Total Pendiente</Text>
        <Text variant="headlineMedium" style={styles.totalAmount}>${totalPending.toFixed(2)}</Text>
      </View>

      <View style={styles.filters}>
        <Chip
          selected={filter === 'Todas'}
          onPress={() => setFilter('Todas')}
          style={styles.chip}
        >Todas</Chip>
        <Chip
          selected={filter === 'Pendientes'}
          onPress={() => setFilter('Pendientes')}
          style={styles.chip}
        >Pendientes</Chip>
        <Chip
          selected={filter === 'Pagadas'}
          onPress={() => setFilter('Pagadas')}
          style={styles.chip}
        >Pagadas</Chip>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
  chip: {
    marginHorizontal: 4,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
