import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const activeDebts = debts.filter(debt => !debt.isPaid);
  const totalAmount = activeDebts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Title style={styles.totalAmount}>${totalAmount.toFixed(2)}</Title>
        </Card.Content>
      </Card>

      {activeDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas pendientes. ¡Qué bien!</Text>
        </View>
      ) : (
        <FlatList
          data={activeDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        small
        icon="plus"
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#e3f2fd',
  },
  totalAmount: {
    fontSize: 28,
    color: '#1976d2',
    marginTop: 8,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
