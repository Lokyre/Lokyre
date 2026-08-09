import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, IconButton, Title } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt } = useDebts();
  const navigation = useNavigation();

  const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtForm', { debt: item })} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${item.amount.toFixed(2)}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-debt-${item.id}`}
          />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title>Total de Deudas</Title>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes.</Text>}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('DebtForm')}
        testID="add-debt-fab"
        label="Nueva Deuda"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 10,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Make sure FAB doesn't cover last item
  },
  card: {
    marginBottom: 10,
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
    color: '#666',
    fontSize: 16,
  }
});

export default HomeScreen;
