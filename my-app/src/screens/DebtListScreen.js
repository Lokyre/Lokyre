import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, IconButton, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtListScreen() {
  const { debts, removeDebt } = useDebts();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
          <Text variant="bodyLarge" style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
          <View style={styles.chipContainer}>
            <Chip icon="tag" style={styles.chip}>{item.type}</Chip>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <IconButton
            icon="check"
            iconColor="#4caf50"
            size={24}
            onPress={() => removeDebt(item.id)}
            accessibilityLabel="Marcar como pagada"
          />
          <IconButton
            icon="delete"
            iconColor="#f44336"
            size={24}
            onPress={() => removeDebt(item.id)}
            accessibilityLabel="Eliminar deuda"
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>No tienes deudas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  amount: {
    color: '#b00020',
    marginVertical: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#e0e0e0',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
});
