import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, ProgressBar, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtListScreen = ({ route, navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const category = route.params?.category;

  const filteredDebts = category
    ? debts.filter(debt => debt.category === category)
    : debts;

  const renderItem = ({ item }) => {
    const progress = item.amount > 0 ? item.paidAmount / item.amount : 0;
    const isPaid = progress >= 1;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { id: item.id })}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title style={styles.title}>{item.title}</Title>
              <Text style={[styles.status, isPaid ? styles.statusPaid : styles.statusPending]}>
                {isPaid ? 'Pagado' : 'Pendiente'}
              </Text>
            </View>
            <Text style={styles.category}>{item.category}</Text>

            <View style={styles.amountsRow}>
              <Paragraph>Pagado: ${item.paidAmount.toFixed(2)}</Paragraph>
              <Paragraph style={styles.totalAmount}>Total: ${item.amount.toFixed(2)}</Paragraph>
            </View>

            <ProgressBar
              progress={progress > 1 ? 1 : progress}
              color={isPaid ? 'green' : theme.colors.primary}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt', { category })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusPaid: {
    backgroundColor: '#e6ffe6',
    color: 'green',
  },
  statusPending: {
    backgroundColor: '#ffe6e6',
    color: 'red',
  },
  category: {
    color: '#666',
    marginBottom: 12,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DebtListScreen;
