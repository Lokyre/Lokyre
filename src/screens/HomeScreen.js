import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Text, Surface } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import DebtItem from '../components/DebtItem';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);

  const totalPending = useMemo(() => {
    return debts
      .filter((debt) => !debt.isPaid)
      .reduce((sum, debt) => sum + debt.amount, 0);
  }, [debts]);

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text variant="titleMedium" style={styles.headerTitle}>Total Pendiente</Text>
        <Text variant="displaySmall" style={styles.headerAmount}>
          ${totalPending.toFixed(2)}
        </Text>
      </Surface>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtItem
            debt={item}
            onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>No tienes deudas registradas.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    opacity: 0.8,
  },
  headerAmount: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 20,
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
    backgroundColor: '#03dac6',
  },
});

export default HomeScreen;
