import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading, toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const pendingDebts = debts.filter(debt => !debt.isPaid);
  const totalPendingAmount = pendingDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Debt",
      "Are you sure you want to delete this debt?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteDebt(id) }
      ]
    );
  };

  const renderDebtItem = ({ item }) => (
    <Card style={[styles.card, item.isPaid && styles.paidCard]} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} | $${item.amount}`}
        left={(props) => <IconButton {...props} icon={item.isPaid ? 'check-circle' : 'circle-outline'} onPress={() => toggleDebtStatus(item.id)} testID={`toggle-status-${item.id}`} />}
        right={(props) => <IconButton {...props} icon="delete" onPress={() => handleDelete(item.id)} testID={`delete-debt-${item.id}`} />}
      />
      {item.description ? (
        <Card.Content>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.totalText}>Total Pending:</Text>
        <Text variant="headlineMedium" style={styles.amountText}>${totalPendingAmount.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No debts found. Add one!</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    color: '#666',
  },
  amountText: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // For FAB
  },
  card: {
    marginBottom: 10,
  },
  paidCard: {
    opacity: 0.6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
