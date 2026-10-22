import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, removeDebt, toggleDebtPaid } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebts = useMemo(() => {
    return debts
      .filter((d) => !d.isPaid)
      .reduce((sum, debt) => sum + debt.amount, 0);
  }, [debts]);

  const renderItem = ({ item }) => (
    <Card style={[styles.card, item.isPaid && styles.paidCard]} testID={`debt-card-${item.id}`}>
      <Card.Content>
        <Title style={item.isPaid ? styles.paidText : null}>{item.name}</Title>
        <Paragraph style={item.isPaid ? styles.paidText : null}>Monto: ${item.amount.toFixed(2)}</Paragraph>
        <Paragraph style={item.isPaid ? styles.paidText : null}>Tipo: {item.type}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton
          testID={`toggle-btn-${item.id}`}
          icon={item.isPaid ? "undo" : "check"}
          iconColor={theme.colors.primary}
          size={24}
          onPress={() => toggleDebtPaid(item.id)}
        />
        <IconButton
          testID={`delete-btn-${item.id}`}
          icon="delete"
          iconColor={theme.colors.error}
          size={24}
          onPress={() => removeDebt(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="titleMedium" style={styles.summaryTitle}>Deuda Total Pendiente</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.error }}>${totalDebts.toFixed(2)}</Text>
      </View>
      <Divider style={styles.divider} />

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
             <Text variant="bodyLarge" style={styles.emptyText}>No tienes deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        testID="fab-add-debt"
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        label="Añadir Deuda"
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
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  paidText: {
    textDecorationLine: 'line-through',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#757575',
  }
});

export default HomeScreen;
