import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalUnpaid = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debt: item })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.type}</Paragraph>
        <Paragraph style={{ color: item.isPaid ? 'green' : 'red' }}>
          ${parseFloat(item.amount).toFixed(2)} - {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total Pendiente</Title>
          <Text style={styles.summaryAmount}>${totalUnpaid.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={[...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        testID="fab"
        style={styles.fab}
        icon="plus"
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
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  summaryTitle: {
    textAlign: 'center',
    color: '#666',
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
