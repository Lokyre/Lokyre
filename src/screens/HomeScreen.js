import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => {
    return debt.status === 'pendiente' ? sum + parseFloat(debt.amount || 0) : sum;
  }, 0);

  const pendingDebts = debts.filter(d => d.status === 'pendiente');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Deuda Total Pendiente</Title>
            <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.recentSection}>
          <Title style={styles.sectionTitle}>Resumen</Title>
          <Text>Deudas Pendientes: {pendingDebts.length}</Text>
          <Text>Deudas Pagadas: {debts.length - pendingDebts.length}</Text>
          <Card style={styles.actionCard} onPress={() => navigation.navigate('DebtList')}>
            <Card.Content>
              <Text style={styles.actionText}>Ver todas las deudas</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Nueva Deuda"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  recentSection: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  actionCard: {
    marginTop: 16,
    backgroundColor: '#e0e0e0',
  },
  actionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
  },
});

export default HomeScreen;
