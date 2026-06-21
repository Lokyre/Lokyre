import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, Text, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => {
    return debt.isPaid ? sum : sum + debt.amount;
  }, 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <Title style={[item.isPaid && styles.paidText]} testID={`debt-title-${item.id}`}>{item.title}</Title>
        <Paragraph style={[item.isPaid && styles.paidText]}>Monto: ${item.amount.toFixed(2)}</Paragraph>
        <Paragraph style={[item.isPaid && styles.paidText]}>Tipo: {item.type}</Paragraph>
        <Paragraph style={[item.isPaid && styles.paidText]}>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddEditDebt')}
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
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  paidCard: {
    backgroundColor: '#e8f5e9',
    opacity: 0.8,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
