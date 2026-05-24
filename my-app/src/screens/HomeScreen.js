import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts } = useDebtContext();
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.concept}</Title>
          <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
          <Paragraph>Tipo: {item.type}</Paragraph>
          <Paragraph style={styles.date}>Fecha: {new Date(item.date).toLocaleDateString()}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Deuda Total</Title>
          <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.listTitle}>Mis Deudas</Text>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas pendientes. ¡Qué bien!</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        label="Agregar Deuda"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#666',
  },
});
