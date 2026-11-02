import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, List, Card, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();
  const [filter, setFilter] = useState('All');

  const filteredDebts = filter === 'All'
    ? debts
    : debts.filter(d => d.category === filter);

  const totalDebt = filteredDebts.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Categoría: {item.category}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.totalText}>Total: ${totalDebt.toFixed(2)}</Title>
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'All', label: 'Todos' },
          { value: 'Tarjetas', label: 'Tarjetas' },
          { value: 'Créditos', label: 'Créditos' },
        ]}
        style={styles.segment}
      />
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'Personas', label: 'Personas' },
          { value: 'Individuales', label: 'Individuales' },
        ]}
        style={styles.segment2}
      />

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  segment: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  segment2: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
