import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { useDebt } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, totalPending, isLoaded } = useDebt();
  const navigation = useNavigation();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetails', { debtId: item.id })}
    >
      <Card.Content>
        <Title style={item.isPaid ? styles.paidText : null}>{item.description}</Title>
        <Paragraph style={item.isPaid ? styles.paidText : null}>
          Cantidad: ${item.amount.toFixed(2)}
        </Paragraph>
        <Paragraph style={item.isPaid ? styles.paidText : null}>
          Categoría: {item.category}
        </Paragraph>
        <Paragraph style={[styles.status, item.isPaid ? styles.paidStatus : styles.pendingStatus]}>
          Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Pendiente</Text>
        <Text style={styles.summaryAmount}>${totalPending.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab-add-debt"
        onPress={() => navigation.navigate('AddDebt')}
        label="Añadir"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 18,
  },
  summaryAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  paidCard: {
    backgroundColor: '#e0e0e0',
  },
  paidText: {
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  status: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  paidStatus: {
    color: '#388e3c',
  },
  pendingStatus: {
    color: '#d32f2f',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
