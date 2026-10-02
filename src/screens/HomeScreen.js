import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebtContext();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.amount || 0), 0);

  const getCategoryTotal = (category) => {
    return debts
      .filter((debt) => debt.category === category)
      .reduce((sum, debt) => sum + Number(debt.amount || 0), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Title style={styles.totalTitle}>Total Deudas</Title>
            <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
              ${totalDebt.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Categorías</Title>
        {CATEGORIES.map((category) => (
          <Card
            key={category}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Category', { category })}
          >
            <Card.Content style={styles.categoryContent}>
              <Title>{category}</Title>
              <Paragraph>${getCategoryTotal(category).toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
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
  totalCard: {
    marginBottom: 24,
    elevation: 4,
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 20,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 16,
  },
  categoryCard: {
    marginBottom: 12,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
