import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { List, FAB, IconButton, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { debts, deleteDebt } = useContext(DebtContext);

  const categoryDebts = debts.filter((debt) => debt.category === category);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={item.description}
      left={(props) => <List.Icon {...props} icon="cash" />}
      right={(props) => (
        <View style={styles.rightContainer}>
          <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id, category })}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor="red"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      {categoryDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={categoryDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt', { category })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default DebtListScreen;
