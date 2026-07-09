import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, useTheme, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalPending = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid ? styles.paidCard : null]}
      onPress={() => navigation.navigate('DebtDetailScreen', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate || 'N/A'}`}
        right={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'alert-circle'}
            iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
          />
        )}
      />
      <Card.Content>
        <Text variant="bodyLarge">Monto: ${item.amount}</Text>
        <Text variant="bodyMedium" style={{ color: item.isPaid ? 'green' : 'red' }}>
          Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="headlineSmall" style={styles.summaryText}>
          Total Pendiente: ${totalPending.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddEditDebtScreen')}
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
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.7,
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
    color: '#888',
  },
});

export default HomeScreen;
