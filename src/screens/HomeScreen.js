import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, toggleDebtStatus, deleteDebt } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const totalPending = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const totalPaid = debts.filter(d => d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })} testID={`debt-card-${item.id}`}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>${item.amount}</Paragraph>
        <View style={styles.row}>
          <Chip icon="tag" style={styles.chip}>{item.category}</Chip>
          <Chip icon="calendar" style={styles.chip}>{item.dueDate}</Chip>
        </View>
        <Text style={{ color: item.isPaid ? 'green' : 'red', marginTop: 8 }}>
          Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={item.isPaid ? "close-circle-outline" : "check-circle-outline"}
          iconColor={item.isPaid ? theme.colors.error : theme.colors.primary}
          size={24}
          onPress={() => toggleDebtStatus(item.id)}
          testID={`toggle-status-${item.id}`}
        />
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          size={24}
          onPress={() => deleteDebt(item.id)}
          testID={`delete-${item.id}`}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Title>Pendiente</Title>
            <Paragraph style={styles.amount}>${totalPending.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content>
            <Title>Pagado</Title>
            <Paragraph style={styles.amount}>${totalPaid.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.listTitle}>Mis Deudas</Text>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    marginRight: 8,
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
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
