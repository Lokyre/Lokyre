import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const pendingDebts = debts.filter((debt) => !debt.isPaid);
  const totalDebt = pendingDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
      testID={`debt-item-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Categoría: {item.category}</Paragraph>
        {item.dueDate ? <Paragraph>Vencimiento: {item.dueDate}</Paragraph> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Deuda Total Pendiente:</Text>
        <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      {pendingDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderDebtItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
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
