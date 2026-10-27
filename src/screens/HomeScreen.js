import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, List, Text, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, removeDebt } = useContext(DebtContext);

  const totalAmount = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${item.amount.toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="delete" onPress={() => removeDebt(item.id)} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Total: ${totalAmount.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
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
