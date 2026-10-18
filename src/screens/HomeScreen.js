import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, List, Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebtContext();
  const theme = useTheme();
  const [filter, setFilter] = useState('Todas'); // Todas, Tarjetas, Créditos, Personas, Individuales

  const filteredDebts = debts.filter(debt => {
    if (filter === 'Todas') return true;
    return debt.category === filter;
  });

  const renderItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={`${item.category} - $${item.amount}`}
      left={props => <List.Icon {...props} icon={item.isPaid ? 'check-circle' : 'alert-circle'} color={item.isPaid ? 'green' : theme.colors.error} />}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    />
  );

  const calculateTotal = () => {
    return filteredDebts
      .filter(d => !d.isPaid)
      .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Total Pendiente: ${calculateTotal()}</Text>
      </View>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'Todas', label: 'Todas' },
          { value: 'Tarjetas', label: 'Tarjetas' },
          { value: 'Créditos', label: 'Créditos' },
          { value: 'Personas', label: 'Personas' },
          { value: 'Individuales', label: 'Indiv.' },
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  segmentedButtons: {
    margin: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
