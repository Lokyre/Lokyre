import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const pendingDebts = debts.filter(debt => debt.status === 'pending');
  const totalDebt = pendingDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Categoría: {item.category}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total a Pagar</Title>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={pendingDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas pendientes.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e53935',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
});

export default HomeScreen;
