import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, ActivityIndicator, Chip } from 'react-native-paper';
import { useDebt } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useDebt();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.title} testID={`debt-title-${item.id}`}>
            {item.title}
          </Text>
          <Text variant="titleMedium" style={styles.amount}>
            ${item.amount}
          </Text>
        </View>
        <View style={styles.chipsContainer}>
          <Chip style={styles.chip} textStyle={styles.chipText}>
            {item.type}
          </Chip>
          <Chip
            style={[styles.chip, item.isPaid ? styles.paidChip : styles.unpaidChip]}
            textStyle={[styles.chipText, item.isPaid ? styles.paidText : styles.unpaidText]}
          >
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Chip>
        </View>
        <Text variant="bodySmall" style={styles.date}>
          Vence: {item.dueDate}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text variant="bodyLarge">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  amount: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
  },
  paidChip: {
    backgroundColor: '#e8f5e9',
  },
  unpaidChip: {
    backgroundColor: '#ffebee',
  },
  paidText: {
    color: '#2e7d32',
  },
  unpaidText: {
    color: '#c62828',
  },
  date: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
