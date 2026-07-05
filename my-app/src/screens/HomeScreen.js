import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, Card, Text, Title, Paragraph, IconButton, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, togglePaid, deleteDebt } = useDebts();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  // Calculate total pending debt
  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, current) => sum + current.amount, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.type}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              onPress={() => togglePaid(item.id)}
            />
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('AddEditDebt', { debt: item })}
            />
            <IconButton
              {...props}
              icon="delete"
              onPress={() => deleteDebt(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text style={styles.amount}>Monto: ${item.amount.toFixed(2)}</Text>
        <Text>Vencimiento: {item.dueDate}</Text>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Total Pendiente</Title>
        <Text style={styles.summaryAmount}>${totalPending.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f', // Red for debt
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
