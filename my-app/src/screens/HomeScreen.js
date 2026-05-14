import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph, useTheme, Chip, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debt: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={item.isPaid ? styles.paidText : {}}>{item.title}</Title>
            <Chip icon="tag" style={styles.chip}>{item.type}</Chip>
          </View>
          <Paragraph style={item.isPaid ? styles.paidText : {}}>
            Total: ${item.amount} | Pagado: ${item.paidAmount}
          </Paragraph>
          <Paragraph style={[styles.date, item.isPaid ? styles.paidText : {}]}>
            Vence: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
          </Paragraph>
          {item.isPaid && <Text style={styles.paidBadge}>PAGADO</Text>}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const sortedDebts = [...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const totalDebt = debts.reduce((acc, curr) => acc + (curr.isPaid ? 0 : curr.amount - curr.paidAmount), 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Deuda Total Pendiente</Title>
        <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
      </View>
      <FlatList
        data={sortedDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
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
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    height: 30,
  },
  date: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#9e9e9e',
  },
  paidBadge: {
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 8,
  }
});
