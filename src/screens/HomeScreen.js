import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Card, Paragraph, IconButton, FAB, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.description}
        subtitle={item.type}
        right={(props) => (
          <TouchableOpacity testID={`delete-${item.id}`} onPress={() => deleteDebt(item.id)}>
             <IconButton {...props} icon="delete" color="red" />
          </TouchableOpacity>
        )}
      />
      <Card.Content>
        <Paragraph>Monto: ${item.amount}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.header}>
        <Text style={styles.totalText}>Total Deudas: ${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay deudas registradas.</Text>
          </View>
        }
      />

      <TouchableOpacity
        testID="fab"
        style={styles.fabContainer}
        onPress={() => navigation.navigate('AddDebt')}
      >
         <FAB
           style={styles.fab}
           icon="plus"
           onPress={() => navigation.navigate('AddDebt')}
           testID="fab-real"
         />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  fabContainer: {
     position: 'absolute',
     margin: 16,
     right: 0,
     bottom: 0,
     zIndex: 1,
  },
  fab: {
    backgroundColor: '#6200ee',
  },
});
