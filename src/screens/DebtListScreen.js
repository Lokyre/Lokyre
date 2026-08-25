import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Chip, FAB } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtListScreen = ({ navigation }) => {
  const { debts } = useDebts();
  const [filter, setFilter] = useState('all'); // all, pendiente, pagado

  const filteredDebts = debts.filter((debt) => {
    if (filter === 'all') return true;
    return debt.status === filter;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>{item.title}</Title>
            <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.cardBody}>
            <Paragraph>Tipo: {item.type}</Paragraph>
            <Chip
              style={[
                styles.statusChip,
                item.status === 'pagado' ? styles.chipPaid : styles.chipPending,
              ]}
              textStyle={styles.chipText}
            >
              {item.status.toUpperCase()}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          Todas
        </Chip>
        <Chip
          selected={filter === 'pendiente'}
          onPress={() => setFilter('pendiente')}
          style={styles.filterChip}
        >
          Pendientes
        </Chip>
        <Chip
          selected={filter === 'pagado'}
          onPress={() => setFilter('pagado')}
          style={styles.filterChip}
        >
          Pagadas
        </Chip>
      </View>

      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas para mostrar.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    elevation: 2,
  },
  filterChip: {
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    height: 28,
  },
  chipPending: {
    backgroundColor: '#ffebee',
  },
  chipPaid: {
    backgroundColor: '#e8f5e9',
  },
  chipText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
  },
});

export default DebtListScreen;
