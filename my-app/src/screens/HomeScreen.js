import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Text, Card, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalAmount = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const sortedDebts = [...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Content>
        <Title style={item.isPaid && styles.paidText}>{item.title}</Title>
        <Paragraph style={item.isPaid && styles.paidText}>Monto: ${item.amount}</Paragraph>
        <Paragraph style={item.isPaid && styles.paidText}>Tipo: {item.type}</Paragraph>
        <Paragraph style={item.isPaid && styles.paidText}>Vence: {new Date(item.dueDate).toLocaleDateString()}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total a Pagar:</Text>
        <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
          ${totalAmount.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={sortedDebts}
        keyExtractor={item => item.id}
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
        onPress={() => navigation.navigate('AddDebt')}
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
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 18,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 15,
  },
  paidCard: {
    opacity: 0.6,
  },
  paidText: {
    textDecorationLine: 'line-through',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
