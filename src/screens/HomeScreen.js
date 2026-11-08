import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useDebts();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const categoryTotals = categories.map(category => {
    const total = debts
      .filter(debt => debt.category === category)
      .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
    return { category, total };
  });

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

        <Title style={styles.sectionTitle}>Resumen por Categoría</Title>
        <View style={styles.grid}>
          {categoryTotals.map(item => (
            <Card
              key={item.category}
              style={styles.gridCard}
              onPress={() => navigation.navigate('DebtList', { category: item.category })}
            >
              <Card.Content style={styles.gridCardContent}>
                <Paragraph style={styles.categoryName}>{item.category}</Paragraph>
                <Text style={styles.categoryAmount}>${item.total.toFixed(2)}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card
          style={styles.allDebtsCard}
          onPress={() => navigation.navigate('DebtList', { category: null })}
        >
           <Card.Content>
             <Text style={styles.allDebtsText}>Ver Todas las Deudas</Text>
           </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Nueva Deuda"
        testID="add-debt-fab"
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
  totalCard: {
    marginBottom: 24,
    elevation: 4,
  },
  totalTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  totalAmount: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  gridCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  allDebtsCard: {
    marginTop: 8,
    elevation: 2,
    alignItems: 'center',
  },
  allDebtsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
