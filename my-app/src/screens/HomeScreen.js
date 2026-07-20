import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, FAB, IconButton, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, isLoaded, toggleDebtPaid, deleteDebt } = useContext(DebtContext);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + d.amount, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.title}
        subtitle={`$${item.amount.toFixed(2)} - ${item.type}`}
        left={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'circle-outline'}
            onPress={() => toggleDebtPaid(item.id)}
            testID={`toggle-${item.id}`}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-${item.id}`}
          />
        )}
      />
      <Card.Content>
        {item.dueDate ? <Text>Vence: {item.dueDate}</Text> : null}
        {item.description ? <Text>{item.description}</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="headlineSmall" testID="total-pending">
          Total Pendiente: ${totalPending.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
