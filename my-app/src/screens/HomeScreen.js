import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Appbar, ActivityIndicator, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Paid'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'Pending') return !debt.isPaid;
    if (filter === 'Paid') return debt.isPaid;
    return true;
  });

  const totalDebts = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={`$${item.amount} - ${item.type}`}
      />
      <Card.Content>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" subtitle={`Total pendiente: $${totalDebts.toFixed(2)}`} />
      </Appbar.Header>

      <View style={styles.filters}>
        <Chip selected={filter === 'All'} onPress={() => setFilter('All')} style={styles.chip}>Todas</Chip>
        <Chip selected={filter === 'Pending'} onPress={() => setFilter('Pending')} style={styles.chip}>Pendientes</Chip>
        <Chip selected={filter === 'Paid'} onPress={() => setFilter('Paid')} style={styles.chip}>Pagadas</Chip>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay deudas para mostrar.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filters: { flexDirection: 'row', padding: 10, justifyContent: 'space-around' },
  chip: { marginHorizontal: 5 },
  list: { padding: 10, paddingBottom: 80 },
  card: { marginBottom: 10 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  empty: { textAlign: 'center', marginTop: 20 }
});

export default HomeScreen;