import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, Card, Title, Paragraph, IconButton, useTheme, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt, toggleStatus } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debt: item })}>
      <Card.Content>
        <Title style={{ textDecorationLine: item.isPaid ? 'line-through' : 'none' }}>
          {item.title}
        </Title>
        <Paragraph>Type: {item.type}</Paragraph>
        <Paragraph>Amount: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        {item.dueDate ? <Paragraph>Due: {item.dueDate}</Paragraph> : null}
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={item.isPaid ? "check-circle" : "circle-outline"}
          iconColor={item.isPaid ? theme.colors.primary : theme.colors.outline}
          size={24}
          onPress={() => toggleStatus(item.id)}
        />
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          size={24}
          onPress={() => deleteDebt(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Debt Manager" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="titleLarge">Total Pending Debt</Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={[...debts].sort((a, b) => {
          if (a.isPaid === b.isPaid) return 0;
          return a.isPaid ? 1 : -1;
        })}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No debts found. Add one!</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
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
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
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
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
  }
});

export default HomeScreen;
