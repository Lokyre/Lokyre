import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = useMemo(() => {
    return debts
      .filter((debt) => !debt.isPaid)
      .reduce((sum, debt) => sum + parseFloat(debt.amount), 0)
      .toFixed(2);
  }, [debts]);

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title style={item.isPaid ? styles.paidText : {}} testID={`debt-title-${item.id}`}>{item.title}</Title>
        <Paragraph style={item.isPaid ? styles.paidText : {}} testID={`debt-subtitle-${item.id}`}>${item.amount} - {item.type}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" testID="loading-indicator" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Deuda Total Pendiente:</Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary }} testID="total-debt">
          ${totalDebt}
        </Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text testID="empty-message">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  paidCard: {
    backgroundColor: '#e0e0e0',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#757575',
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
