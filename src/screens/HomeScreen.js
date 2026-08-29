import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Deuda Total: ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay deudas registradas.</Text>
          </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
