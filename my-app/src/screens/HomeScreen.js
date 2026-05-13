import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, List } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`${item.type} - Due: ${item.dueDate || 'N/A'}`}
      right={props => <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pending Debt</Title>
          <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No pending debts recorded.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  amount: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
