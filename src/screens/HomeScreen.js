import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB, useTheme, Title, Paragraph } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

const HomeScreen = () => {
  const { debts } = useDebts();
  const navigation = useNavigation();
  const theme = useTheme();

  const totalAmount = debts.reduce((sum, debt) => sum + (Number(debt.amount) || 0), 0);

  const getCategoryTotal = (category) => {
    return debts
      .filter(debt => debt.type === category)
      .reduce((sum, debt) => sum + (Number(debt.amount) || 0), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Title style={styles.totalTitle}>Total Deudas</Title>
            <Paragraph style={styles.totalAmount}>
              ${totalAmount.toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>

        <Title style={styles.categoriesTitle}>Categorías</Title>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Card
              key={category}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('List', { category })}
              testID={`category-card-${category}`}
            >
              <Card.Content>
                <Title>{category}</Title>
                <Paragraph>${getCategoryTotal(category).toFixed(2)}</Paragraph>
              </Card.Content>
            </Card>
          ))}
          <Card
             style={styles.categoryCard}
             onPress={() => navigation.navigate('List')}
             testID={`category-card-all`}
          >
             <Card.Content>
               <Title>Todas las Deudas</Title>
               <Paragraph>${totalAmount.toFixed(2)}</Paragraph>
             </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEdit')}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  totalCard: {
    marginBottom: 24,
    backgroundColor: '#6200ee',
  },
  totalTitle: {
    color: 'white',
    textAlign: 'center',
  },
  totalAmount: {
    color: 'white',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  categoriesTitle: {
    marginBottom: 16,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
