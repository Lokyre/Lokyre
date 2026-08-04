import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Title, Paragraph, IconButton, Text, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt, toggleDebtStatus, isReady } = useContext(DebtContext);

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalDebt = debts
    .filter(d => !d.isPaid)
    .reduce((sum, current) => sum + parseFloat(current.amount), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.concept}
        subtitle={`${item.type} - $${parseFloat(item.amount).toFixed(2)}`}
        left={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'circle-outline'}
            iconColor={item.isPaid ? 'green' : 'grey'}
            onPress={() => toggleDebtStatus(item.id)}
            testID={`toggle-status-${item.id}`}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-debt-${item.id}`}
          />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
};

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
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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
