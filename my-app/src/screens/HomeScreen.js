import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { DebtContext } from '../context/DebtContext';
import { Card, Title, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  const totalAmount = debts.reduce((sum, debt) => (!debt.isPaid ? sum + Number(debt.amount) : sum), 0);
  const activeDebts = debts.filter((debt) => !debt.isPaid);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={item.type}
      />
      <Card.Content>
        <Paragraph>${item.amount}</Paragraph>
        <Paragraph>Vence: {item.dueDate}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard} testID="summary-card">
        <Card.Title title="Total Pendiente" />
        <Card.Content>
          <Title>${totalAmount.toFixed(2)}</Title>
        </Card.Content>
      </Card>

      <FlatList
        data={activeDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
