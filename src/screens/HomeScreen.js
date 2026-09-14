import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt, isLoaded } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);

  const renderDebtItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <Text style={styles.amountText}>${parseFloat(item.amount).toFixed(2)}</Text>
            <IconButton
              {...props}
              icon="delete"
              onPress={() => deleteDebt(item.id)}
              testID={`delete-btn-${item.id}`}
            />
          </View>
        )}
      />
      {item.description ? (
        <Card.Content>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Total Deudas</Title>
        <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
      </View>

      {!isLoaded ? (
        <View style={styles.center}><Text>Cargando...</Text></View>
      ) : debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDebtItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        icon="plus"
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
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#555',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;
