import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, toggleDebtPaid } = useDebts();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.cardPaid]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.debtTitle} testID={`debt-title-${item.id}`}>{item.title}</Text>
          <Text>{item.type} - Vence: {item.dueDate}</Text>
          <Title style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Title>
        </View>
        <IconButton
          icon={item.isPaid ? 'check-circle' : 'circle-outline'}
          iconColor={item.isPaid ? theme.colors.primary : theme.colors.onSurfaceVariant}
          size={30}
          onPress={() => toggleDebtPaid(item.id)}
          testID={`toggle-paid-${item.id}`}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total de Deudas Pendientes</Title>
          <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
          </View>
        }
      />

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B00020',
  },
  listContainer: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardPaid: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  debtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
