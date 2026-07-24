import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, Text, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, loading } = useDebts();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>${item.amount}</Paragraph>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Paragraph style={styles.totalAmount}>${totalPending.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
  },
  paidCard: {
    opacity: 0.6,
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
  },
});

export default HomeScreen;
