import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`$${item.amount} - ${item.type}`}
      />
      <Card.Content>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  const totalAmount = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Total Pendiente:</Text>
        <Text variant="headlineMedium">${totalAmount.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
