import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebts();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, { borderColor: item.isPaid ? 'green' : 'red', borderWidth: 1 }]}
      onPress={() => navigation.navigate('DebtDetails', { id: item.id })}
    >
      <Card.Title title={item.title} subtitle={item.type} />
      <Card.Content>
        <Text variant="titleMedium">Monto: ${item.amount}</Text>
        <Text variant="bodyMedium">Vencimiento: {item.dueDate}</Text>
        <Text variant="bodySmall" style={{ color: item.isPaid ? 'green' : 'red' }}>
          Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No hay deudas registradas.</Text>
          </View>
        }
      />
      <FAB
        testID="fab"
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
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
  list: {
    padding: 16,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
