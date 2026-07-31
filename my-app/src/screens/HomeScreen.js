import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, isLoading } = useDebts();
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type}`}
        testID={`debt-title-${item.id}`}
      />
      <Card.Content>
        <Text variant="bodyMedium">Monto: ${item.amount}</Text>
        <Text variant="bodySmall">Vence: {item.dueDate}</Text>
        <Text variant="bodySmall" style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
