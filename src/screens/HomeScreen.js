import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebtContext();
  const theme = useTheme();

  const pendingDebts = debts.filter(debt => !debt.isPaid);
  const totalPendingAmount = pendingDebts.reduce((sum, debt) => sum + (debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={[styles.title, item.isPaid && styles.paidText]}>
              {item.title}
            </Title>
            <Text style={[styles.amount, item.isPaid && styles.paidText]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Chip icon="tag" style={styles.chip}>{item.type}</Chip>
            {item.isPaid ? (
              <Chip icon="check-circle" style={styles.statusChipPaid} textStyle={{ color: 'white' }}>Pagado</Chip>
            ) : (
              <Chip icon="clock-outline" style={styles.statusChipPending}>Pendiente</Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Total Pendiente</Text>
        <Text style={styles.summaryAmount}>${totalPendingAmount.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 5,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#9e9e9e',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#e0e0e0',
  },
  statusChipPaid: {
    backgroundColor: '#4caf50',
  },
  statusChipPending: {
    backgroundColor: '#ff9800',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
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
