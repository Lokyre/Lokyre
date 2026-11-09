import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebts, DebtCategories } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getCategoryTotal = (category) => {
    return debts
      .filter(debt => debt.category === category)
      .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Title style={styles.totalTitle}>Total Deuda</Title>
          <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.categoriesContainer}>
        {Object.values(DebtCategories).map((category) => (
          <Card
            key={category}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DebtList', { category })}
          >
            <Card.Content>
              <Title>{category}</Title>
              <Paragraph>${getCategoryTotal(category).toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDebt')}
      >
        Añadir Deuda
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
  totalCard: {
    marginBottom: 20,
    backgroundColor: '#ff5252',
  },
  totalTitle: {
    color: 'white',
    fontSize: 20,
  },
  totalAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
    padding: 8,
  },
});

export default HomeScreen;
