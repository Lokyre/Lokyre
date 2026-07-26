import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebts();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'paid'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'pending') return !debt.isPaid;
    if (filter === 'paid') return debt.isPaid;
    return true;
  });

  const renderDebt = ({ item }) => (
    <TouchableOpacity testID={`debt-card-${item.id}`} onPress={() => navigation.navigate('DebtDetail', { id: item.id })}>
      <Card style={[styles.card, item.isPaid ? styles.cardPaid : styles.cardPending]}>
        <Card.Title title={item.title} subtitle={item.type} />
        <Card.Content>
          <Paragraph>Monto: ${item.amount}</Paragraph>
          <Paragraph>Vencimiento: {item.dueDate}</Paragraph>
          <Paragraph>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button mode={filter === 'all' ? 'contained' : 'outlined'} onPress={() => setFilter('all')}>Todas</Button>
        <Button mode={filter === 'pending' ? 'contained' : 'outlined'} onPress={() => setFilter('pending')}>Pendientes</Button>
        <Button mode={filter === 'paid' ? 'contained' : 'outlined'} onPress={() => setFilter('paid')}>Pagadas</Button>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderDebt}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddDebt')}
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  cardPaid: {
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
    borderWidth: 1,
  },
  cardPending: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    borderWidth: 1,
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
    fontSize: 16,
    color: '#666',
  }
});

export default HomeScreen;
