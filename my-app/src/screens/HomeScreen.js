import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Card, SegmentedButtons, Title, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const [filter, setFilter] = useState('active'); // 'active', 'paid', 'all'

  const filteredDebts = debts.filter(debt => {
    if (filter === 'active') return !debt.isPaid;
    if (filter === 'paid') return debt.isPaid;
    return true;
  });

  const sortedDebts = [...filteredDebts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Text variant="bodyMedium">Type: {item.type}</Text>
        <Text variant="bodyMedium">Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <Text variant="titleMedium" style={{ color: item.isPaid ? 'green' : theme.colors.error, marginTop: 8 }}>
          Amount: ${parseFloat(item.amount).toFixed(2)} {item.isPaid ? '(Paid)' : ''}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total {filter === 'active' ? 'Owed' : filter === 'paid' ? 'Paid' : 'Debts'}</Title>
        <Text variant="headlineMedium">${totalAmount.toFixed(2)}</Text>
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'active', label: 'Active' },
          { value: 'paid', label: 'Paid' },
          { value: 'all', label: 'All' },
        ]}
        style={styles.segmentedButtons}
      />

      <FlatList
        data={sortedDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No debts found.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segmentedButtons: {
    margin: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
