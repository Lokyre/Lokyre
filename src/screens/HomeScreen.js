import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt, toggleDebtStatus } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const pendingDebts = debts.filter(d => !d.isPaid);
  const totalPendingAmount = pendingDebts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtForm', { debtId: item.id })}>
      <Card.Title
        title={item.description}
        subtitle={`Monto: $${item.amount}`}
        right={(props) => (
          <View style={styles.cardRight}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
              onPress={() => toggleDebtStatus(item.id)}
              testID={`toggle-status-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(item.id)}
              testID={`delete-${item.id}`}
            />
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.chipContainer}>
          <Chip icon="label" style={styles.chip}>{item.type}</Chip>
        </View>
        <Paragraph style={{ color: item.isPaid ? theme.colors.primary : theme.colors.error }}>
          Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente:</Title>
        <Text variant="displaySmall" style={{ color: theme.colors.error }}>
          ${totalPendingAmount.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium">No hay deudas registradas.</Text>
          </View>
        }
      />
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        icon="plus"
        onPress={() => navigation.navigate('DebtForm')}
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
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardRight: {
    flexDirection: 'row',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
