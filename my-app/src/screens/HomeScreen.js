import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
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

  const totalPending = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={item.type}
        titleVariant="titleMedium"
        subtitleVariant="bodyMedium"
      />
      <Card.Content>
        <Text variant="bodyLarge">${parseFloat(item.amount).toFixed(2)}</Text>
        <Text variant="bodySmall" style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="titleLarge">Total Pendiente</Text>
        <Text variant="headlineMedium">${totalPending.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
