import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type} | Vence: ${item.dueDate}`}
      />
      <Card.Content>
        <Text variant="titleMedium">${parseFloat(item.amount).toFixed(2)}</Text>
        <Text variant="bodySmall" style={item.isPaid ? styles.paidText : styles.pendingText}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Total Pendiente</Text>
        <Text variant="headlineMedium" style={styles.totalAmount}>
          ${totalPending.toFixed(2)}
        </Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyLarge">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  list: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  paidCard: {
    opacity: 0.7,
  },
  paidText: {
    color: '#388e3c',
    fontWeight: 'bold',
    marginTop: 5,
  },
  pendingText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
