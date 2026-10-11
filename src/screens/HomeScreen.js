import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const CATEGORY_COLORS = {
  Tarjetas: '#e53935',
  Créditos: '#1e88e5',
  Personas: '#43a047',
  Individuales: '#fb8c00',
};

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.paid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card style={[styles.card, item.paid && styles.cardPaid]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardLeft}>
            <Title style={[item.paid && styles.textPaid]}>{item.description}</Title>
            <Chip
              style={[styles.chip, { backgroundColor: CATEGORY_COLORS[item.category] || theme.colors.primary }]}
              textStyle={styles.chipText}
            >
              {item.category}
            </Chip>
          </View>
          <View style={styles.cardRight}>
            <Title style={[item.paid && styles.textPaid]}>${parseFloat(item.amount).toFixed(2)}</Title>
            {item.paid ? <Text style={styles.paidBadge}>Pagado</Text> : null}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total Deuda Pendiente</Title>
          <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
          </View>
        }
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
  summaryCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  summaryTitle: {
    textAlign: 'center',
    color: '#666',
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e53935',
    marginTop: 8,
  },
  list: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardPaid: {
    opacity: 0.7,
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
  chip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  textPaid: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  paidBadge: {
    color: '#43a047',
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
