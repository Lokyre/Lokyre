import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.amount || 0), 0);

  const categorizedDebts = debts.reduce((acc, debt) => {
    const type = debt.type || 'Other';
    acc[type] = (acc[type] || 0) + Number(debt.amount || 0);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Total Debt</Title>
          <Paragraph style={[styles.totalAmount, { color: theme.colors.error }]}>
            ${totalDebt.toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Summary by Type</Title>
      {Object.keys(categorizedDebts).length === 0 ? (
        <Text style={styles.emptyText}>No debts yet. Add one to get started!</Text>
      ) : (
        Object.keys(categorizedDebts).map(type => (
          <Card key={type} style={styles.summaryCard}>
            <Card.Content style={styles.summaryRow}>
              <Text style={styles.summaryType}>{type}</Text>
              <Text style={styles.summaryAmount}>${categorizedDebts[type].toFixed(2)}</Text>
            </Card.Content>
          </Card>
        ))
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('DebtsList')}
        style={styles.button}
      >
        View All Debts
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('AddDebt')}
        style={styles.button}
      >
        Add New Debt
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  summaryCard: {
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 10,
  }
});

export default HomeScreen;
