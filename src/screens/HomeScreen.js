import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, useTheme, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = () => {
  const { debts, isLoaded } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  if (!isLoaded) {
    return <View style={styles.container}><Text>Cargando...</Text></View>;
  }

  const totalPending = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getDebtTypeLabel = (type) => {
    switch(type) {
      case 'tarjeta': return 'Tarjeta';
      case 'credito': return 'Crédito';
      case 'persona': return 'Persona';
      default: return 'Otro';
    }
  };

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={item.isPaid ? "Pagada" : "Pendiente"}
        right={(props) => (
          <View {...props} style={styles.amountContainer}>
             <Text style={item.isPaid ? styles.paidText : styles.unpaidText}>
                ${parseFloat(item.amount).toFixed(2)}
             </Text>
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.chipContainer}>
          <Chip icon="tag" style={styles.chip}>{getDebtTypeLabel(item.type)}</Chip>
        </View>
        {item.dueDate ? (
          <Paragraph style={styles.dueDate}>Vence: {new Date(item.dueDate).toLocaleDateString()}</Paragraph>
        ) : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.totalTitle}>Total Pendiente</Title>
        <Text style={styles.totalAmount}>${totalPending.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalTitle: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.7,
  },
  amountContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  unpaidText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  paidText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c',
    textDecorationLine: 'line-through',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  dueDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
