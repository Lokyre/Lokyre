import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, FAB, Text, Card, IconButton, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, removeDebt, isLoaded } = useContext(DebtContext);

  if (!isLoaded) {
    return null;
  }

  const getTotalDebt = () => debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={`${item.category} - ${new Date(item.date).toLocaleDateString()}`}
      right={props => (
        <View style={styles.rightContainer}>
          <Text style={styles.amountText}>${parseFloat(item.amount).toFixed(2)}</Text>
          <IconButton icon="delete" onPress={() => removeDebt(item.id)} />
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Title title="Total Deudas" subtitle="Pendiente" />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.totalAmount}>${getTotalDebt().toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        testID="add-debt-fab"
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Agregar Deuda')}
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
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#e53935',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    marginRight: 8,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
