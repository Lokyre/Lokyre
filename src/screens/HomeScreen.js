import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Checkbox, IconButton, useTheme, Appbar } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, toggleDebtPaid, deleteDebt } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + d.amount, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('EditDebt', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${item.amount.toFixed(2)}`}
        left={(props) => (
          <Checkbox
            status={item.isPaid ? 'checked' : 'unchecked'}
            onPress={() => toggleDebtPaid(item.id)}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
          />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Gestor de Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="headlineSmall">Total Pendiente:</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.error }}>
          ${totalPending.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
