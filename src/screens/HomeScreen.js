import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts } = useDebts();
  const navigation = useNavigation();

  const totalDebt = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - ${item.date}`}
        right={(props) => (
          <View style={styles.chipContainer}>
            <Chip
              selectedColor={item.isPaid ? 'green' : 'red'}
              mode="outlined"
            >
              ${item.amount}
            </Chip>
          </View>
        )}
      />
      {item.isPaid && (
        <Card.Content>
          <Text style={styles.paidText}>Pagado</Text>
        </Card.Content>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="titleLarge">Deuda Total Pendiente:</Text>
        <Text variant="headlineLarge" style={styles.totalAmount}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  chipContainer: {
    marginRight: 15,
  },
  paidText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});