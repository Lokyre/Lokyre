import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pendingDebts = debts.filter((d) => !d.isPaid);
  const totalPending = pendingDebts.reduce((sum, d) => sum + d.amount, 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debt: item })}>
      <Card style={[styles.card, item.isPaid && styles.paidCard]} testID={`debt-item-${item.id}`}>
        <Card.Title
          title={item.title}
          subtitle={`$${item.amount.toFixed(2)} - ${item.type}`}
        />
        <Card.Content>
          <Text testID={`debt-title-${item.id}`} style={{display: 'none'}}>{item.title}</Text>
          <Text testID={`debt-subtitle-${item.id}`} style={{display: 'none'}}>{`$${item.amount.toFixed(2)} - ${item.type}`}</Text>
          <Text style={{ color: item.isPaid ? 'green' : theme.colors.error }}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="titleMedium">Total Pendiente</Text>
        <Text variant="headlineLarge" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
          ${totalPending.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
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
    flex: 1,
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
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
