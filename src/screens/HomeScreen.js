import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, IconButton, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading, deleteDebt } = useDebts();

  const totalAmount = debts
    .filter(d => d.status === 'pending')
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.status === 'paid' && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type} | Estado: ${item.status === 'paid' ? 'Pagado' : 'Pendiente'}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-btn-${item.id}`}
          />
        )}
      />
      <Card.Content>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title>Total Pendiente</Title>
        <Text style={styles.totalText}>${totalAmount.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
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
}

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
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  paidCard: {
    opacity: 0.6,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
