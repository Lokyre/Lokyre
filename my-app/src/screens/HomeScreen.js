import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Surface } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => !debt.isPaid ? sum + parseFloat(debt.amount) : sum, 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { debt: item })}>
      <Card style={[styles.card, item.isPaid && styles.cardPaid]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={[item.isPaid && styles.textPaid]}>{item.name}</Title>
            <Text style={[styles.amount, item.isPaid && styles.textPaid]}>
              ${parseFloat(item.amount).toFixed(2)}
            </Text>
          </View>
          <Paragraph style={[item.isPaid && styles.textPaid]}>
            Tipo: {item.type}
          </Paragraph>
          <Paragraph style={[item.isPaid && styles.textPaid]}>
            Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={4}>
        <Text style={styles.headerTitle}>Total Pendiente</Text>
        <Text style={styles.headerAmount}>${totalDebt.toFixed(2)}</Text>
      </Surface>

      <FlatList
        data={debts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
  headerAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardPaid: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b00020',
  },
  textPaid: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
