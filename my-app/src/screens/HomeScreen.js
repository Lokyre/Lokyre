import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, List } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`${item.type} - Vence: ${item.dueDate}`}
      right={props => <Text {...props} style={styles.amount}>${item.remainingAmount.toFixed(2)}</Text>}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Deuda Total</Text>
          <Text variant="headlineLarge" style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.listTitle}>Deudas Pendientes</Text>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes.</Text>}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    marginBottom: 24,
    paddingVertical: 16,
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  listTitle: {
    marginBottom: 8,
  },
  amount: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
