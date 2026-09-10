import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Chip, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalAmount = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
  const pendingAmount = debts
    .filter(d => !d.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Tarjeta': return theme.colors.error;
      case 'Crédito': return theme.colors.primary;
      case 'Persona': return theme.colors.tertiary;
      default: return theme.colors.secondary;
    }
  };

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - ${new Date(item.date).toLocaleDateString()}`}
        right={(props) => (
          <Text {...props} style={styles.amount}>
            {formatCurrency(item.amount)}
          </Text>
        )}
      />
      <Card.Content>
        {item.isPaid ? (
          <Chip icon="check" style={styles.paidChip}>Pagado</Chip>
        ) : (
          <Chip icon="clock-outline" style={styles.pendingChip}>Pendiente</Chip>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Resumen de Deudas</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
              Total: {formatCurrency(totalAmount)}
            </Text>
            <Text variant="titleLarge">
              Pendiente: {formatCurrency(pendingAmount)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
  summaryContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paidCard: {
    opacity: 0.7,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 16,
  },
  paidChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
  },
  pendingChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3e0',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
