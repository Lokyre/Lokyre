import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, FAB, Card, Text, IconButton, Chip, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const theme = useTheme();

  const totalAmount = debts
    .filter(d => !d.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

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
    <Card style={[styles.card, item.isPaid && styles.paidCard]} onPress={() => navigation.navigate('AddDebt', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${parseFloat(item.amount).toFixed(2)}`}
        left={(props) => <IconButton {...props} icon={getIconForType(item.type)} />}
        right={(props) => (
          <View style={styles.cardActions}>
            <Chip
              icon={item.isPaid ? 'check' : 'close'}
              onPress={() => toggleDebtStatus(item.id)}
              style={item.isPaid ? styles.paidChip : styles.unpaidChip}
            >
              {item.isPaid ? 'Pagado' : 'Pendiente'}
            </Chip>
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(item.id)}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <Appbar.Header elevated>
        <Appbar.Content title="Mis Deudas" subtitle={`Total Pendiente: $${totalAmount.toFixed(2)}`} />
      </Appbar.Header>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No hay deudas registradas.</Text>
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
        testID="add-debt-fab"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.7,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  paidChip: {
    backgroundColor: '#c8e6c9',
  },
  unpaidChip: {
    backgroundColor: '#ffcdd2',
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
});

export default HomeScreen;
