import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, ActivityIndicator, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebtContext();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const totalDebt = debts.reduce((acc, curr) => (!curr.isPaid ? acc + parseFloat(curr.amount) : acc), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total a pagar:</Title>
        <Text style={styles.totalText}>${totalDebt.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        testID="fab"
        icon="plus"
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
