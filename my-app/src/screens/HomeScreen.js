import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, List, Text, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, isReady } = useDebts();
  const theme = useTheme();

  const totalAmount = useMemo(() => {
    return debts
      .filter(d => !d.isPaid)
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  }, [debts]);

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${item.type} - Vence: ${item.dueDate}`}
      left={props => <List.Icon {...props} icon={item.isPaid ? 'check-circle' : 'alert-circle'} color={item.isPaid ? 'green' : 'orange'} />}
      right={props => <Text {...props} style={{ alignSelf: 'center', fontWeight: 'bold' }}>${item.amount}</Text>}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Pendiente</Text>
          <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
            ${totalAmount.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
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
  summaryCard: {
    margin: 16,
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
  }
});
