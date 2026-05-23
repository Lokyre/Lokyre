import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme, Surface } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const calculateTotal = (type = null) => {
    const filteredDebts = type ? debts.filter(d => d.type === type) : debts;
    return filteredDebts.reduce((total, debt) => {
      const paidAmount = (debt.payments || []).reduce((sum, p) => sum + p.amount, 0);
      return total + (debt.totalAmount - paidAmount);
    }, 0);
  };

  const totalPending = calculateTotal();

  const renderItem = ({ item }) => {
    const paidAmount = (item.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const remaining = item.totalAmount - paidAmount;

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}>
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>Tipo: {item.type}</Paragraph>
          <Paragraph>Total: ${item.totalAmount.toFixed(2)}</Paragraph>
          <Paragraph>Pendiente: ${remaining.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={[styles.summaryContainer, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
        <Title style={{ textAlign: 'center', marginBottom: 10 }}>Resumen de Deudas</Title>
        <Text variant="headlineMedium" style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Total Pendiente: ${totalPending.toFixed(2)}
        </Text>
        <View style={styles.breakdownContainer}>
          <Text>Tarjetas: ${calculateTotal('Tarjetas').toFixed(2)}</Text>
          <Text>Créditos: ${calculateTotal('Créditos').toFixed(2)}</Text>
          <Text>Personas: ${calculateTotal('Personas').toFixed(2)}</Text>
          <Text>Individuales: ${calculateTotal('Individuales').toFixed(2)}</Text>
        </View>
      </Surface>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => navigation.navigate('AddDebt')}
        label="Agregar"
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  breakdownContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
