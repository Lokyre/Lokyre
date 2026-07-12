import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Card, FAB, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Content>
        <Card.Title
          title={item.title}
          subtitle={`${item.type} - Vence: ${item.dueDate}`}
        />
        <Title>${parseFloat(item.amount).toFixed(2)}</Title>
        <Paragraph>{item.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Total Adeudado:</Title>
        <Title style={styles.headerAmount}>${totalDebt.toFixed(2)}</Title>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('DebtForm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    color: '#555',
  },
  headerAmount: {
    fontSize: 24,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;
