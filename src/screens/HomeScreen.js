import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { debts, loading } = useContext(DebtContext);
  const [filter, setFilter] = useState('pending');

  const filteredDebts = useMemo(() => {
    return debts.filter((debt) => {
      if (filter === 'pending') return !debt.isPaid;
      if (filter === 'paid') return debt.isPaid;
      return true; // all
    });
  }, [debts, filter]);

  const totalAmount = useMemo(() => {
    return filteredDebts.reduce((sum, debt) => sum + Number(debt.amount), 0);
  }, [filteredDebts]);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-item-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${Number(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Title>Cargando deudas...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total {filter === 'pending' ? 'Pendiente' : filter === 'paid' ? 'Pagado' : ''}: ${totalAmount.toFixed(2)}</Title>
      </View>

      <View style={styles.filterContainer}>
        <Button
          mode={filter === 'pending' ? 'contained' : 'outlined'}
          onPress={() => setFilter('pending')}
          testID="filter-pending"
        >
          Pendientes
        </Button>
        <Button
          mode={filter === 'paid' ? 'contained' : 'outlined'}
          onPress={() => setFilter('paid')}
          testID="filter-paid"
        >
          Pagadas
        </Button>
        <Button
          mode={filter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setFilter('all')}
          testID="filter-all"
        >
          Todas
        </Button>
      </View>

      {filteredDebts.length === 0 ? (
        <View style={styles.center}>
          <Paragraph>No hay deudas en esta categoría.</Paragraph>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
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
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  center: {
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

export default HomeScreen;
