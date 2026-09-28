import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, FAB, Card, Text, IconButton, Chip, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.monto, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={item.concepto}
        subtitle={`$${item.monto.toFixed(2)}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              testID={`toggle-status-${item.id}`}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? theme.colors.primary : theme.colors.onSurfaceVariant}
              onPress={() => toggleDebtStatus(item.id)}
            />
            <IconButton
              {...props}
              testID={`delete-${item.id}`}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Chip style={styles.chip} textStyle={styles.chipText}>
          {item.tipo}
        </Chip>
        <Text variant="bodySmall" style={{ marginTop: 8, color: item.isPaid ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
          {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Gestor de Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="titleMedium">Deuda Total Pendiente</Text>
        <Text variant="headlineLarge" style={{ color: theme.colors.error }}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        testID="addDebtFAB"
        icon="plus"
        style={styles.fab}
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
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // For FAB
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  cardActions: {
    flexDirection: 'row',
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  }
});

export default HomeScreen;
