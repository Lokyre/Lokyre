import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, FAB, Text, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtsListScreen = ({ navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);

  // create a copy of the array before sorting, as per guidelines
  const sortedDebts = [...debts].sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`Type: ${item.type} | Amount: $${Number(item.amount).toFixed(2)}`}
      left={props => <List.Icon {...props} icon="currency-usd" />}
      right={props => (
        <IconButton
          {...props}
          icon="delete"
          color="red"
          onPress={() => deleteDebt(item.id)}
        />
      )}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      {sortedDebts.length === 0 ? (
        <Text style={styles.emptyText}>No debts in the list. Add some!</Text>
      ) : (
        <FlatList
          data={sortedDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DebtsListScreen;
