import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Appbar } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { getCategorizedDebts, getTotalDebt } = useDebtContext();
  const theme = useTheme();

  const categorizedDebts = getCategorizedDebts();
  const totalDebt = getTotalDebt();

  const categories = Object.keys(categorizedDebts);

  const { deleteDebt } = useDebtContext();

  const renderDebtItem = ({ item }) => (
    <Card style={styles.card} onPress={() => {}}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Title>{item.title}</Title>
          <Paragraph>Monto: ${item.amount}</Paragraph>
        </View>
        <FAB
          style={styles.deleteFab}
          icon="delete"
          size="small"
          onPress={() => deleteDebt(item.id)}
          testID={`delete-debt-${item.id}`}
        />
      </Card.Content>
    </Card>
  );

  const renderCategory = ({ item: category }) => {
    const debtsInCategory = categorizedDebts[category];
    if (debtsInCategory.length === 0) return null;

    return (
      <View style={styles.categoryContainer}>
        <Text style={[styles.categoryTitle, { color: theme.colors.primary }]}>{category}</Text>
        <FlatList
          data={debtsInCategory}
          keyExtractor={(item) => item.id}
          renderItem={renderDebtItem}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.totalContainer}>
        <Text variant="titleMedium">Total Pendiente</Text>
        <Text variant="headlineMedium" style={styles.totalAmount}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        color="white"
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
  totalContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  totalAmount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Padding for FAB
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  deleteFab: {
    margin: 8,
    backgroundColor: '#d32f2f',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
