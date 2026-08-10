import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const [filterType, setFilterType] = useState('All');

  const filteredDebts = filterType === 'All'
    ? debts
    : debts.filter(debt => debt.type === filterType);

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
        {item.isPaid && <Paragraph style={{color: 'green'}}>Pagado</Paragraph>}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total deudas: ${totalAmount.toFixed(2)}</Title>
      </View>

      <SegmentedButtons
        value={filterType}
        onValueChange={setFilterType}
        buttons={[
          { value: 'All', label: 'Todas' },
          { value: 'Tarjeta', label: 'Tarjetas' },
          { value: 'Crédito', label: 'Créditos' },
          { value: 'Persona', label: 'Personas' },
        ]}
        style={styles.segmentedButtons}
      />

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segmentedButtons: {
    margin: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // for FAB
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
  },
});

export default HomeScreen;
