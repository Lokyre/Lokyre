import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, IconButton, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, removeDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>Categoría: {item.type}</Paragraph>
        <Paragraph style={styles.amountText}>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="delete" onPress={() => removeDebt(item.id)} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Deuda Total</Text>
        <Text variant="displaySmall" style={styles.totalText}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas pendientes.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 4,
  },
  totalText: {
    color: '#d32f2f',
    marginTop: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  amountText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
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

export default HomeScreen;
