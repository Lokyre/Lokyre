import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Text,
  Card,
  FAB,
  IconButton,
  ActivityIndicator,
  useTheme,
  Chip,
} from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading, deleteDebt, toggleDebtStatus } = useDebts();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalPaid = debts
    .filter((d) => d.isPaid)
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
              onPress={() => toggleDebtStatus(item.id)}
            />
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.row}>
          <Chip icon="tag" style={styles.chip}>
            {item.type}
          </Chip>
          {item.dueDate ? (
            <Chip icon="calendar" style={styles.chip}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Chip>
          ) : null}
        </View>
        {item.description ? (
          <Text variant="bodyMedium" style={styles.description}>
            {item.description}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.errorContainer }]}>
          <Card.Content>
            <Text variant="titleMedium">Pendiente</Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.error }}>
              ${totalPending.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text variant="titleMedium">Pagado</Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
              ${totalPaid.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyLarge">No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
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
