import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, SegmentedButtons } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { SummaryCard } from '../components/SummaryCard';
import { DebtItem } from '../components/DebtItem';

export const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();
  const [filter, setFilter] = useState('pendientes');

  const filteredDebts = debts.filter((debt) => {
    if (filter === 'pendientes') return !debt.isPaid;
    if (filter === 'pagadas') return debt.isPaid;
    return true;
  });

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalPaid = debts
    .filter((d) => d.isPaid)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <View style={styles.container}>
      <SummaryCard totalPending={totalPending} totalPaid={totalPaid} />

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'todas', label: 'Todas' },
          { value: 'pendientes', label: 'Pendientes' },
          { value: 'pagadas', label: 'Pagadas' },
        ]}
        style={styles.filters}
      />

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtItem
            debt={item}
            onPress={() => navigation.navigate('DetallesDeuda', { debtId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AgregarDeuda')}
        label="Nueva"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filters: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
