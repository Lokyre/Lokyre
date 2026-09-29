import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, isLoaded, removeDebt } = useDebts();

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <Text>Cargando deudas...</Text>
      </View>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>Categoría: {item.category}</Paragraph>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="check"
          testID={`remove-${item.id}`}
          onPress={() => removeDebt(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="headlineMedium">Total: ${totalDebt.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text>No hay deudas pendientes.</Text>
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
        testID="add-debt-fab"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
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
