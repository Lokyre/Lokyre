import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, List, FAB, Text, SegmentedButtons, Card } from 'react-native-paper';
import { DebtContext } from './DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const [filter, setFilter] = useState('Todos');

  const filteredDebts = filter === 'Todos'
    ? debts
    : debts.filter(debt => debt.type === filter);

  const totalDebt = filteredDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getIconForType = (type) => {
    switch (type) {
      case 'Tarjetas': return 'credit-card';
      case 'Créditos': return 'bank';
      case 'Personas': return 'account';
      case 'Individuales': return 'account-cash';
      default: return 'cash';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'Todos', label: 'Todos' },
            { value: 'Tarjetas', label: 'Tarjetas' },
            { value: 'Créditos', label: 'Créditos' },
            { value: 'Personas', label: 'Personas' },
            { value: 'Individuales', label: 'Indiv.' },
          ]}
          density="small"
        />
      </View>

      <Card style={styles.totalCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Pendiente</Text>
          <Text variant="headlineMedium" style={styles.totalAmount}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.type} - ${item.description || ''}`}
            left={props => <List.Icon {...props} icon={getIconForType(item.type)} />}
            right={props => (
              <View {...props} style={styles.amountContainer}>
                <Text style={styles.amountText}>${parseFloat(item.amount).toFixed(2)}</Text>
              </View>
            )}
            onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
            style={styles.listItem}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
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
  filterContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  totalCard: {
    margin: 10,
    backgroundColor: '#e0f7fa',
  },
  totalAmount: {
    color: '#006064',
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  amountContainer: {
    justifyContent: 'center',
    paddingRight: 10,
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#d32f2f',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
