import React from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt } = useDebtContext();
  const theme = useTheme();

  const totalAmount = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const handleEdit = (debt) => {
    navigation.navigate('AddEditDebt', { debtId: debt.id });
  };

  const handleDelete = (id) => {
    // Note: Alert does not work seamlessly in all web test environments.
    // For simplicity, we just delete it directly, or rely on a simple alert.
    deleteDebt(id);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>
        No tienes deudas registradas.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Total a Pagar:</Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          ${totalAmount.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DebtCard debt={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
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
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
