import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalOwed = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title style={{ textDecorationLine: item.isPaid ? 'line-through' : 'none' }}>
          {item.title}
        </Title>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Total Pendiente</Title>
        <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
          ${totalOwed.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
