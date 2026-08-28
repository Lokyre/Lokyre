import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useDebtContext();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pendingDebts = debts.filter(d => d.status === 'Pendiente');
  const totalPending = pendingDebts.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const summaryByCategory = categories.map(category => {
    const total = pendingDebts
      .filter(d => d.type === category)
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    return { category, total };
  }).filter(item => item.total > 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Pendiente</Text>
            <Text variant="displaySmall" style={[styles.totalAmount, { color: theme.colors.error }]}>
              ${totalPending.toFixed(2)}
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              {pendingDebts.length} deudas pendientes
            </Text>
          </Card.Content>
        </Card>

        {summaryByCategory.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Por Categoría</Text>
            {summaryByCategory.map((item) => (
              <Card key={item.category} style={styles.categoryCard}>
                <Card.Title
                  title={item.category}
                  right={(props) => (
                    <Text {...props} variant="titleMedium" style={{ marginRight: 16 }}>
                      ${item.total.toFixed(2)}
                    </Text>
                  )}
                />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab-add"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  summaryCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  totalAmount: {
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  categoryCard: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
