import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, List, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Monto: ${item.amount.toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.headerTitle}>Deuda Total</Title>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

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
  headerContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  headerTitle: {
    fontSize: 18,
    color: '#666666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 5,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default HomeScreen;
