import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, ActivityIndicator, Card, Title } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading, deleteDebt, toggleDebtStatus } = useContext(DebtContext);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => {
    return debt.isPaid ? sum : sum + parseFloat(debt.amount);
  }, 0);

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Deuda Pendiente</Title>
          <Text style={styles.totalText}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onDelete={() => deleteDebt(item.id)}
            onToggleStatus={() => toggleDebtStatus(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
