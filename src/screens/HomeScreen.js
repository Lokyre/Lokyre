import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => {
    return debt.status !== 'pagado' ? sum + (debt.totalAmount - (debt.totalPaid || 0)) : sum;
  }, 0);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'tarjetas': return '#e53935';
      case 'créditos': return '#1e88e5';
      case 'personas': return '#43a047';
      default: return '#757575';
    }
  };

  const renderItem = ({ item }) => {
    const pendingAmount = item.totalAmount - (item.totalPaid || 0);

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title>{item.title}</Title>
            <Chip
              style={{ backgroundColor: getCategoryColor(item.category) }}
              textStyle={{ color: 'white' }}
            >
              {item.category}
            </Chip>
          </View>
          <Paragraph>Vencimiento: {new Date(item.dueDate).toLocaleDateString()}</Paragraph>
          <View style={styles.amountsRow}>
            <Text style={styles.totalText}>Total: ${item.totalAmount.toFixed(2)}</Text>
            <Text style={[styles.pendingText, { color: item.status === 'pagado' ? 'green' : 'red' }]}>
              {item.status === 'pagado' ? 'Pagado' : `Pendiente: $${pendingAmount.toFixed(2)}`}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return <View style={styles.container}><Text>Cargando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Total Pendiente</Title>
        <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
    padding: 20,
    backgroundColor: '#ffffff',
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
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  pendingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
