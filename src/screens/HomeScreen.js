import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, List } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${item.category} - Vence: ${item.dueDate || 'N/A'}`}
      right={props => <Text style={styles.amount}>${item.amount}</Text>}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Resumen de Deudas</Title>
          <Paragraph style={styles.totalText}>Total: ${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <Title style={styles.listTitle}>Mis Deudas</Title>

      {debts.length === 0 ? (
        <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab-add"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    marginBottom: 16,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  listTitle: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#757575',
  },
  amount: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
