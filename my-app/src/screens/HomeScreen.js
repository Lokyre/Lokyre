import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Appbar } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalDebt = debts
    .filter(d => !d.isPaid)
    .reduce((sum, debt) => sum + Number(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate}`}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={item.isPaid ? styles.paidText : styles.unpaidText}>
          Monto: ${item.amount} {item.isPaid ? '(Pagada)' : ''}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="titleLarge">Total Pendiente: ${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={[...debts].sort((a, b) => Number(a.isPaid) - Number(b.isPaid))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        testID="fab"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.7,
  },
  paidText: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaidText: {
    color: 'red',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
});

export default HomeScreen;
