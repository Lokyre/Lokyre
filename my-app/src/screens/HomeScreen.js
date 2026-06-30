import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Appbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const getDebtIcon = (type) => {
  switch (type) {
    case 'Tarjeta': return 'credit-card';
    case 'Crédito': return 'bank';
    case 'Persona': return 'account';
    case 'Individual': return 'cash';
    default: return 'cash';
  }
};

const getDebtColor = (type, theme) => {
  switch (type) {
    case 'Tarjeta': return theme.colors.error;
    case 'Crédito': return theme.colors.primary;
    case 'Persona': return theme.colors.secondary;
    case 'Individual': return theme.colors.tertiary;
    default: return theme.colors.primary;
  }
};

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      mode={item.isPaid ? 'contained' : 'elevated'}
    >
      <Card.Title
        title={item.title}
        subtitle={`Vence: ${item.dueDate} - Tipo: ${item.type}`}
        left={(props) => <Appbar.Action {...props} icon={getDebtIcon(item.type)} color={getDebtColor(item.type, theme)} />}
      />
      <Card.Content>
        <Text variant="titleMedium" style={{ color: item.isPaid ? 'grey' : 'black' }}>
          Monto: ${parseFloat(item.amount).toFixed(2)}
        </Text>
        {item.isPaid && <Text style={{ color: 'green', fontWeight: 'bold' }}>PAGADA</Text>}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.totalText}>
          Total Pendiente:
        </Text>
        <Text variant="displaySmall" style={styles.totalAmount}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={[...debts].sort((a, b) => {
          if (a.isPaid === b.isPaid) return 0;
          return a.isPaid ? 1 : -1; // Unpaid first
        })}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  totalText: {
    color: '#666',
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
