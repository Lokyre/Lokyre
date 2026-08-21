import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, Button, SegmentedButtons } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts } = useDebtContext();
  const navigation = useNavigation();
  const [filter, setFilter] = useState('all');

  const filteredDebts = debts.filter((debt) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !debt.paid;
    if (filter === 'paid') return debt.paid;
    return true;
  });

  const totalPending = debts.reduce((sum, debt) => (!debt.paid ? sum + parseFloat(debt.amount) : sum), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debt: item })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.type}</Paragraph>
        <Text style={[styles.amount, { color: item.paid ? 'green' : 'red' }]}>
          ${parseFloat(item.amount).toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total Deuda Pendiente</Title>
          <Text style={styles.summaryAmount}>${totalPending.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'Todas' },
          { value: 'pending', label: 'Pendientes' },
          { value: 'paid', label: 'Pagadas' },
        ]}
        style={styles.segmentedButtons}
      />

      <FlatList
        data={filteredDebts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  summaryTitle: {
    textAlign: 'center',
    fontSize: 18,
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
