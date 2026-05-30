import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebts();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.amount), 0);

  const categories = [
    { label: 'Tarjetas', value: 'tarjetas', icon: 'credit-card' },
    { label: 'Créditos', value: 'creditos', icon: 'bank' },
    { label: 'Personas', value: 'personas', icon: 'account-group' },
    { label: 'Individuales', value: 'individuales', icon: 'account' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Text variant="titleLarge">Deuda Total</Text>
            <Text variant="displaySmall" style={{ color: theme.colors.error }}>
              ${totalDebt.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Categorías
        </Text>

        <View style={styles.categoriesContainer}>
          {categories.map((cat) => {
            const categoryDebts = debts.filter((d) => d.category === cat.value);
            const categoryTotal = categoryDebts.reduce((sum, d) => sum + Number(d.amount), 0);

            return (
              <Card
                key={cat.value}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('DebtList', { category: cat.value })}
              >
                <Card.Title title={cat.label} />
                <Card.Content>
                  <Text variant="bodyLarge">${categoryTotal.toFixed(2)}</Text>
                  <Text variant="bodySmall">{categoryDebts.length} deudas</Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  sectionTitle: {
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
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
