import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, IconButton, Divider } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt } = useDebtContext();

  const totalAmount = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={item.category}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-button-${item.id}`}
          />
        )}
      />
      <Card.Content>
        <Title>${parseFloat(item.amount).toFixed(2)}</Title>
        {item.description ? <Paragraph>{item.description}</Paragraph> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Deudas Pendientes</Text>
        <Text style={styles.summaryAmount}>${totalAmount.toFixed(2)}</Text>
      </View>
      <Divider />

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
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
  summaryContainer: {
    padding: 20,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 5,
    elevation: 3,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF4081',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
  },
});
