import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, List, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, removeDebt } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Tarjetas':
        return 'credit-card';
      case 'Créditos':
        return 'bank';
      case 'Personas':
        return 'account';
      case 'Individuales':
        return 'account-cash';
      default:
        return 'cash';
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <List.Icon icon={getIconForCategory(item.category)} />
          <View>
            <Title>{item.description}</Title>
            <Paragraph>{item.category}</Paragraph>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Title style={styles.amount}>${item.amount.toFixed(2)}</Title>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => removeDebt(item.id)}
            testID={`delete-btn-${item.id}`}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Paragraph style={styles.summaryText}>Total Deuda Pendiente</Paragraph>
          <Title style={styles.totalAmount}>${totalDebt.toFixed(2)}</Title>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
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
    backgroundColor: '#e3f2fd',
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
  totalAmount: {
    fontSize: 32,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    color: '#d32f2f',
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default HomeScreen;
