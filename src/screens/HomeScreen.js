import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts } = useDebtContext();
  const navigation = useNavigation();
  const theme = useTheme();

  const activeDebts = debts.filter(d => !d.isPaid);

  const totalAmount = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.description}
        subtitle={`Tipo: ${item.type}`}
        right={(props) => (
          <Text {...props} style={{ marginRight: 16, fontWeight: 'bold' }}>
            ${item.amount.toFixed(2)}
          </Text>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primaryContainer }]}>
        <Title>Total a pagar:</Title>
        <Text style={styles.totalText}>${totalAmount.toFixed(2)}</Text>
      </View>

      {activeDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Paragraph>No tienes deudas activas.</Paragraph>
        </View>
      ) : (
        <FlatList
          data={activeDebts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
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
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b00020',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 12,
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
