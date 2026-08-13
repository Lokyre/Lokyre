import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  // Calculate total debt (only counting 'Pendiente')
  const totalDebt = debts
    .filter(d => d.status === 'Pendiente')
    .reduce((sum, current) => sum + parseFloat(current.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate || 'N/A'}`}
        testID={`debt-title-${item.id}`}
      />
      <Card.Content>
        <Title>${parseFloat(item.amount).toFixed(2)}</Title>
        <Paragraph style={{ color: item.status === 'Pagado' ? 'green' : 'red' }}>
          {item.status}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Total Pendiente:</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
        label="Nueva Deuda"
      />
    </View>
  );
}

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
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // space for FAB
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
