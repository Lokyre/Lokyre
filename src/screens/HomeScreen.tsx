import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, Divider, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <Title style={{ textDecorationLine: item.isPaid ? 'line-through' : 'none' }}>
          {item.title}
        </Title>
        <Paragraph>Monto: ${item.amount.toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title>Total deudas pendientes:</Title>
        <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>
      <Divider />

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab-add-debt"
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
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  list: {
    padding: 10,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
