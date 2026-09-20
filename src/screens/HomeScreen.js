import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Title, Paragraph, Chip } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebtContext();

  const totalDebt = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tarjetas': return '#ffcccb';
      case 'Créditos': return '#c8e6c9';
      case 'Personas': return '#bbdefb';
      case 'Individuales': return '#ffe082';
      default: return '#e0e0e0';
    }
  };

  const renderDebtItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-item-${item.id}`}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={item.isPaid ? styles.paidText : {}}>{item.title}</Title>
          <Chip style={{ backgroundColor: getCategoryColor(item.category) }}>{item.category}</Chip>
        </View>
        <Paragraph style={item.isPaid ? styles.paidText : {}}>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        {item.dueDate && <Paragraph style={item.isPaid ? styles.paidText : {}}>Vence: {item.dueDate}</Paragraph>}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Deuda Total Pendiente</Title>
        <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
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
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  paidText: {
    textDecorationLine: 'line-through',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#f4511e',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
