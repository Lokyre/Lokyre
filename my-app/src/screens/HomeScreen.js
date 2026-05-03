import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const pendingDebts = debts.filter(debt => debt.status === 'pending');

  const totalOwed = pendingDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <View style={styles.debtItem}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Type: {item.type}</Text>
        <Text>Amount: ${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Paid" onPress={() => markAsPaid(item.id)} />
        <Button title="Delete" color="red" onPress={() => deleteDebt(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Total Owed: ${totalOwed.toFixed(2)}</Text>

      <FlatList
        data={pendingDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No pending debts!</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDebt')}
      >
        <Text style={styles.addButtonText}>Add Debt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  debtItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
