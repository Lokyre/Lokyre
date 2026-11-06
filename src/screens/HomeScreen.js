import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, togglePaidStatus, deleteDebt } = useDebts();
  const theme = useTheme();

  const totalUnpaid = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + d.amount, 0);

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
    <Card style={[styles.card, item.isPaid && styles.paidCard]} mode="elevated">
      <Card.Title
        title={item.title}
        subtitle={`$${item.amount.toFixed(2)}`}
        left={(props) => <IconButton {...props} icon={getIconForType(item.type)} />}
        right={(props) => (
          <View style={styles.cardActions}>
             <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? theme.colors.primary : theme.colors.onSurfaceVariant}
              onPress={() => togglePaidStatus(item.id)}
              testID={`status-button-${item.id}`}
            />
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
              testID={`edit-button-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(item.id)}
              testID={`delete-button-${item.id}`}
            />
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.chipContainer}>
          <Chip icon="tag" style={styles.chip} compact>{item.type}</Chip>
        </View>
        {item.notes ? (
           <Paragraph style={styles.notes}>{item.notes}</Paragraph>
        ) : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente</Title>
        <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
          ${totalUnpaid.toFixed(2)}
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
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  cardActions: {
    flexDirection: 'row',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
  },
  chip: {
    marginRight: 8,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});
