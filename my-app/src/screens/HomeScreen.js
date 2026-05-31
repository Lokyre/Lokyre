import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, Title, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalPending = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.debtInfo}>
          <Title>{item.title}</Title>
          <Text>{item.type} - {new Date(item.dueDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.amountInfo}>
          <Title style={{ color: item.isPaid ? 'green' : theme.colors.error }}>
            ${parseFloat(item.amount).toFixed(2)}
          </Title>
          <Text>{item.isPaid ? 'Pagado' : 'Pendiente'}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Deuda Pendiente</Title>
          <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
            ${totalPending.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={[...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
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
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtInfo: {
    flex: 1,
  },
  amountInfo: {
    alignItems: 'flex-end',
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
    color: '#666',
  },
});

export default HomeScreen;
