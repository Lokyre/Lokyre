import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Tarjetas': return 'credit-card';
    case 'Créditos': return 'bank';
    case 'Personas': return 'account-group';
    case 'Individuales': return 'account';
    default: return 'cash';
  }
};

const HomeScreen = ({ navigation }) => {
  const { debts, getTotalDebt } = useContext(DebtContext);
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Text style={styles.cardAmount}>${item.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.chipContainer}>
          <Chip icon={getCategoryIcon(item.category)} compact>
            {item.category}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerText}>Deuda Total Pendiente</Text>
        <Text variant="displaySmall" style={[styles.totalAmount, { color: theme.colors.error }]}>
          ${getTotalDebt().toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              No tienes deudas registradas. ¡Genial!
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        label="Nueva Deuda"
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerText: {
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // for FAB
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  }
});

export default HomeScreen;
