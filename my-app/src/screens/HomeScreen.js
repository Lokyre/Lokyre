import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading, toggleDebtStatus } = useDebtContext();

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    >
      <Card.Title
        title={item.title}
        titleTestID={`debt-title-${item.id}`}
        subtitle={`Amount: $${item.amount} | Due: ${item.dueDate || 'N/A'}`}
        subtitleTestID={`debt-subtitle-${item.id}`}
        left={(props) => <IconButton {...props} icon="currency-usd" />}
        right={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'circle-outline'}
            iconColor={item.isPaid ? 'green' : 'gray'}
            onPress={() => toggleDebtStatus(item.id)}
            testID={`toggle-status-${item.id}`}
          />
        )}
      />
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="headlineSmall" style={styles.summaryText}>
          Total Pending: ${totalPending.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No debts found. Add one!</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
