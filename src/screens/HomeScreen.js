import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const getSummary = () => {
    const summary = {};
    categories.forEach(cat => {
      summary[cat] = debts
        .filter(d => d.category === cat && !d.paid)
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    });
    return summary;
  };

  const summary = getSummary();
  const totalDebt = debts
    .filter(d => !d.paid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderDebtItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })} testID={`debt-item-${item.id}`}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>{item.category} - ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>{item.paid ? 'Pagado' : 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Title>Resumen de Deudas</Title>
        <Text style={styles.totalText}>Total Pendiente: ${totalDebt.toFixed(2)}</Text>
        {categories.map(cat => (
          <Text key={cat}>{cat}: ${summary[cat].toFixed(2)}</Text>
        ))}
      </View>

      <Title style={styles.listTitle}>Todas las Deudas</Title>
      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  listTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
