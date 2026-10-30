import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Title, Card, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import DebtItem from '../components/DebtItem';

export default function HomeScreen() {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalDebt = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const breakdown = debts
    .filter((d) => !d.isPaid)
    .reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + Number(d.amount);
      return acc;
    }, {});

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total de Deudas Pendientes</Title>
          <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      {Object.keys(breakdown).length > 0 ? (
        <View style={styles.breakdownContainer}>
           <Title style={styles.sectionTitle}>Desglose</Title>
           {Object.keys(breakdown).map((type) => (
             <View key={type} style={styles.breakdownRow}>
                <Text>{type}</Text>
                <Text>${breakdown[type].toFixed(2)}</Text>
             </View>
           ))}
        </View>
      ) : null}

      <Title style={styles.sectionTitle}>Tus Deudas</Title>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DebtItem debt={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  breakdownContainer: {
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
