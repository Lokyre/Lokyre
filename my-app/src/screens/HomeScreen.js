import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Title>{item.title}</Title>
          <Paragraph>{item.type} - {new Date(item.date).toLocaleDateString()}</Paragraph>
        </View>
        <View style={styles.cardRight}>
          <Title style={{ color: item.isPaid ? 'green' : theme.colors.error }}>
            ${parseFloat(item.amount).toFixed(2)}
          </Title>
          {item.isPaid ? <Text style={{ color: 'green' }}>Paid</Text> : <Text style={{ color: theme.colors.error }}>Pending</Text>}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total Pending Debt</Title>
          <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={[...debts].sort((a, b) => new Date(b.date) - new Date(a.date))}
        keyExtractor={item => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No debts yet. Add one!</Text>}
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
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
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
