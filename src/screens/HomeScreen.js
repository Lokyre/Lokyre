import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Card, Text, IconButton, useTheme, Surface } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebts = debts.length;
  const pendingDebtsCount = debts.filter(d => !d.isPaid).length;
  const paidDebtsCount = debts.filter(d => d.isPaid).length;

  const totalPendingAmount = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteDebt(id), style: 'destructive' }
      ]
    );
  };

  const renderDebtItem = ({ item }) => (
    <Card style={styles.card} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.name}
        subtitle={`${item.type} - $${parseFloat(item.amount).toFixed(2)}`}
        left={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? "check-circle" : "clock-outline"}
            iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
            onPress={() => toggleDebtStatus(item.id)}
            testID={`toggle-status-${item.id}`}
          />
        )}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
              testID={`edit-debt-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
              testID={`delete-debt-${item.id}`}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.summaryContainer} elevation={2}>
        <Text variant="titleMedium" style={styles.summaryText}>
          Total deudas: {totalDebts}
        </Text>
        <Text variant="titleMedium" style={styles.summaryText}>
          Pendientes: {pendingDebtsCount} | Pagadas: {paidDebtsCount}
        </Text>
        <Text variant="titleLarge" style={[styles.summaryText, { color: theme.colors.error, marginTop: 10 }]}>
          Total Pendiente: ${totalPendingAmount.toFixed(2)}
        </Text>
      </Surface>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
  summaryContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  summaryText: {
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  }
});
