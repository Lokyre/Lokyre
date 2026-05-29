import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtDetail', { debt: item })}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Deudas Pendientes</Title>
        <Text style={styles.totalText}>Total a Pagar: ${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#6200ee', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  totalText: { color: 'white', fontSize: 18, marginTop: 5 },
  list: { padding: 10, paddingBottom: 80 },
  card: { marginBottom: 10, elevation: 3 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03dac6',
  },
});
