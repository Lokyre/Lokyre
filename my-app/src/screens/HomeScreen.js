import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDeudas = debts
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('Detalle de Deuda', { id: item.id })}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Fecha Vencimiento: {item.dueDate}</Paragraph>
        <View style={styles.chipsContainer}>
          <Chip icon="tag" style={styles.chip}>{item.type}</Chip>
          <Chip
            icon={item.status === 'paid' ? 'check' : 'clock-outline'}
            style={item.status === 'paid' ? styles.chipPaid : styles.chipPending}
            textStyle={{ color: 'white' }}
          >
            {item.status === 'paid' ? 'Pagado' : 'Pendiente'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Pendiente</Text>
        <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
          ${totalDeudas.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Agregar Deuda')}
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
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
  },
  chipPending: {
    backgroundColor: '#f44336',
  },
  chipPaid: {
    backgroundColor: '#4caf50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#757575',
  },
});

export default HomeScreen;
