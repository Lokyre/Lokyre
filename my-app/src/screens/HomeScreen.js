import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const CATEGORIES = [
  { id: 'tarjetas', title: 'Tarjetas de Crédito', icon: 'credit-card' },
  { id: 'creditos', title: 'Créditos y Préstamos', icon: 'bank' },
  { id: 'personas', title: 'Deudas a Personas', icon: 'account-group' },
  { id: 'individuales', title: 'Deudas Individuales', icon: 'account' },
];

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" testID="activity-indicator" />
      </View>
    );
  }

  const getTotalDebt = () => {
    return debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);
  };

  const getCategoryTotal = (categoryId) => {
    return debts
      .filter((debt) => debt.category === categoryId)
      .reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Title style={styles.totalTitle}>Total Adeudado</Title>
          <Paragraph style={styles.totalAmount}>${getTotalDebt().toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Categorías</Text>

      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DebtList', { category: category.id, title: category.title })}
          >
            <Card.Content>
              <Title style={styles.categoryTitle}>{category.title}</Title>
              <Paragraph style={styles.categoryAmount}>
                ${getCategoryTotal(category.id).toFixed(2)}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCard: {
    marginBottom: 24,
    backgroundColor: '#e3f2fd',
  },
  totalTitle: {
    fontSize: 20,
    color: '#1565c0',
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0d47a1',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
});

export default HomeScreen;
