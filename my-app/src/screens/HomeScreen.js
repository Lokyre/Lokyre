import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pendingAmount = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={item.type}
      />
      <Card.Content>
        <Text testID={`debt-amount-${item.id}`}>Monto: ${item.amount}</Text>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente:</Title>
        <Title style={styles.amount}>${pendingAmount.toFixed(2)}</Title>
      </View>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
        color="white"
      />
    </View>
  );
}

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
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  amount: {
    fontSize: 28,
    color: '#d32f2f',
    marginTop: 5,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
