import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, FAB, Card, Text, Chip, SegmentedButtons } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();
  const [filter, setFilter] = useState('pending'); // 'pending' or 'paid'

  const filteredDebts = debts.filter((debt) =>
    filter === 'pending' ? !debt.isPaid : debt.isPaid
  );

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text variant="titleMedium">{item.title}</Text>
          <Text variant="bodyMedium" style={styles.typeText}>{item.type}</Text>
          {item.dueDate && (
             <Text variant="bodySmall">Vence: {item.dueDate}</Text>
          )}
        </View>
        <View style={styles.cardRight}>
          <Text variant="titleMedium" style={styles.amount}>
            ${item.amount.toFixed(2)}
          </Text>
          <Chip icon={item.isPaid ? 'check' : 'clock-outline'} style={styles.statusChip}>
            {item.isPaid ? 'Pagada' : 'Pendiente'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.segmentContainer}>
         <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'pending', label: 'Pendientes' },
            { value: 'paid', label: 'Pagadas' },
          ]}
        />
      </View>

      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">No hay deudas {filter === 'pending' ? 'pendientes' : 'pagadas'}.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  segmentContainer: {
    padding: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // espacio para el FAB
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  typeText: {
    color: '#666',
    marginVertical: 4,
  },
  amount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusChip: {
    height: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
