import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, FAB, Text, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import DebtItem from '../components/DebtItem';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoaded } = useContext(DebtContext);

  const totalAmount = debts.reduce((sum, debt) => sum + Number(debt.amount || 0), 0);

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <Text>Cargando deudas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total de Deudas</Title>
          <Text style={styles.summaryAmount}>${totalAmount.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtItem
            debt={item}
            onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes deudas pendientes. ¡Excelente!</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab-add-debt"
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
  },
  summaryTitle: {
    textAlign: 'center',
    color: '#1976d2',
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 80, // Space for FAB
  },
  emptyContainer: {
    padding: 32,
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
    backgroundColor: '#1976d2',
  },
});

export default HomeScreen;
