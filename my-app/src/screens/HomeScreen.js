import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts
    .filter((d) => !d.isPaid)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={item.isPaid ? styles.paidText : null}>
            {item.title}
          </Title>
          <Paragraph>Tipo: {item.type}</Paragraph>
          <Paragraph>Monto: ${item.amount.toFixed(2)}</Paragraph>
          <Paragraph style={item.isPaid ? styles.paidStatus : styles.pendingStatus}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total Pendiente:</Text>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        label="Agregar Deuda"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  totalAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  paidStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03dac6',
  },
});
