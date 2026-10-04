import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, FAB, Text, Card, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getIconForType = (type) => {
    switch (type) {
      case 'Tarjetas': return 'credit-card';
      case 'Créditos': return 'bank';
      case 'Personas': return 'account-group';
      case 'Individuales': return 'account';
      default: return 'cash';
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={`${item.type} - ${new Date(item.date).toLocaleDateString()}`}
      left={props => <List.Icon {...props} icon={getIconForType(item.type)} />}
      right={() => <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Text variant="titleMedium">Deuda Total</Text>
          <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  totalCard: {
    margin: 16,
    elevation: 4,
  },
  listContainer: {
    paddingBottom: 80,
  },
  amount: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
