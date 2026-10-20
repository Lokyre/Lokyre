import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoaded } = useDebts();
  const theme = useTheme();

  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('Detalles', { debtId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={item.isPaid ? styles.paidText : styles.pendingText}>
            ${Number(item.amount).toFixed(2)}
          </Title>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Paragraph numberOfLines={1}>{item.description}</Paragraph>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString('es-ES')}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total Pendiente</Title>
          <Text style={styles.totalAmount}>${totalPending.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
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
        testID="fab-add-debt"
        onPress={() => navigation.navigate('Agregar')}
        label="Agregar Deuda"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#6200ee',
  },
  summaryTitle: {
    color: 'white',
    textAlign: 'center',
  },
  totalAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidText: {
    color: 'green',
    textDecorationLine: 'line-through',
  },
  pendingText: {
    color: 'red',
  },
  typeText: {
    fontWeight: 'bold',
    color: '#666',
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;
