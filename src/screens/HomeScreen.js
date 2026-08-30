import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, FAB, IconButton, useTheme, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt, togglePaidStatus } = useContext(DebtContext);
  const theme = useTheme();

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtForm', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.name}
        subtitle={`${item.type} - Vence: ${item.dueDate || 'N/A'}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'close' : 'check'}
              iconColor={item.isPaid ? theme.colors.error : theme.colors.primary}
              onPress={() => togglePaidStatus(item.id)}
              testID={`toggle-status-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
              testID={`delete-btn-${item.id}`}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="titleLarge" style={styles.amount}>
          ${parseFloat(item.amount).toFixed(2)}
        </Text>
        {item.description ? <Text variant="bodyMedium">{item.description}</Text> : null}
        <View style={styles.statusContainer}>
          <Chip icon={item.isPaid ? 'check-circle' : 'alert-circle'} style={item.isPaid ? styles.chipPaid : styles.chipPending}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="headlineSmall">Total Pendiente</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.error }}>
          ${totalPending.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('DebtForm')}
        testID="fab-add-debt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  listContainer: {
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
  amount: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statusContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  chipPending: {
    backgroundColor: '#ffebee',
  },
  chipPaid: {
    backgroundColor: '#e8f5e9',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
