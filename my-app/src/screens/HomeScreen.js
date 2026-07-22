import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebtContext();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const activeDebts = debts.filter(d => !d.isPaid);
  const totalAmount = activeDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtDetails', { id: item.id })} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate || 'N/A'}`}
        testID={`debt-title-${item.id}`}
      />
      <Card.Content>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Title>Total Pendiente:</Title>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
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
  summary: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
