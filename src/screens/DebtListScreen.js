import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SegmentedButtons, Text, ActivityIndicator } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import DebtCard from '../components/DebtCard';

const DebtListScreen = ({ navigation }) => {
  const { debts, loading } = useDebtContext();
  const [filter, setFilter] = useState('Pendiente'); // 'Pendiente', 'Pagado', 'Todos'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const filteredDebts = debts
    .filter(debt => filter === 'Todos' || debt.status === filter)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge">No hay deudas para mostrar.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'Pendiente', label: 'Pendientes' },
            { value: 'Pagado', label: 'Pagados' },
            { value: 'Todos', label: 'Todos' },
          ]}
        />
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default DebtListScreen;
