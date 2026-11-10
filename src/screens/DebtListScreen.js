import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtListScreen({ route }) {
  const { category } = route.params;
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);

  const filteredDebts = debts.filter(debt => debt.type === category);

  const toggleStatus = (debt) => {
    updateDebt({ ...debt, status: debt.status === 'pendiente' ? 'pagado' : 'pendiente' });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={item.status === 'pagado' ? styles.paidText : null}>{item.title}</Title>
          <IconButton
            icon="delete"
            iconColor="#d32f2f"
            size={20}
            onPress={() => deleteDebt(item.id)}
            testID={`delete-btn-${item.id}`}
          />
        </View>
        <Paragraph style={styles.amount}>${item.amount.toFixed(2)}</Paragraph>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => toggleStatus(item)}
          color={item.status === 'pagado' ? 'green' : 'orange'}
          testID={`status-btn-${item.id}`}
        >
          {item.status === 'pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 4,
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
