import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, toggleDebtPaid, deleteDebt } = useContext(DebtContext);

  const totalDebts = debts
    .filter(d => !d.isPaid)
    .reduce((sum, current) => sum + parseFloat(current.amount), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title testID={`debt-title-${item.id}`}>{item.title}</Title>
          <Text style={styles.amount}>${item.amount}</Text>
        </View>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Vence: {item.dueDate}</Paragraph>
        {item.description ? <Paragraph>Notas: {item.description}</Paragraph> : null}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode={item.isPaid ? 'contained' : 'outlined'}
          onPress={() => toggleDebtPaid(item.id)}
        >
          {item.isPaid ? 'Pagado' : 'Marcar Pagado'}
        </Button>
        <IconButton
          icon="delete"
          iconColor="red"
          size={24}
          onPress={() => deleteDebt(item.id)}
          accessibilityLabel="Eliminar deuda"
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Total a pagar:</Text>
        <Text variant="displaySmall" style={styles.totalAmount}>${totalDebts.toFixed(2)}</Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        testID="fab"
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        label="Agregar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingBottom: 100, // Espacio para el FAB
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  actions: {
    justifyContent: 'space-between',
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
    fontSize: 16,
    color: '#757575',
  },
});

export default HomeScreen;
