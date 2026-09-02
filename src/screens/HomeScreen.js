import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, IconButton, FAB, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, removeDebt, getTotalDebtAmount } = useDebts();
  const theme = useTheme();

  const totalAmount = getTotalDebtAmount();

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated" testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.name}
        subtitle={`${item.type} - Vence: ${item.dueDate || 'N/A'}`}
        right={(props) => (
          <View style={styles.actions}>
            <Text style={{ ...styles.amount, color: theme.colors.error }}>
              ${Number(item.amount).toFixed(2)}
            </Text>
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              testID={`delete-btn-${item.id}`}
              onPress={() => removeDebt(item.id)}
            />
          </View>
        )}
      />
      {item.description ? (
        <Card.Content>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="titleMedium" style={styles.summaryLabel}>
          Total de deudas pendientes
        </Text>
        <Text variant="displaySmall" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
          ${totalAmount.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
              No tienes deudas pendientes. ¡Genial!
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        testID="add-debt-fab"
        onPress={() => navigation.navigate('AddDebt')}
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  summaryLabel: {
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // for FAB
  },
  card: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
