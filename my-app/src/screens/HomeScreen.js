import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.paid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getCategoryTotal = (category) => {
    return debts
      .filter(debt => debt.category === category && !debt.paid)
      .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
  };

  const categories = [
    { label: 'Tarjetas', value: 'card' },
    { label: 'Créditos', value: 'loan' },
    { label: 'Personas', value: 'person' },
    { label: 'Individual', value: 'individual' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Title style={styles.totalTitle}>Total Deuda Pendiente</Title>
            <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Resumen por Categoría</Title>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <Card key={cat.value} style={styles.categoryCard}>
              <Card.Content>
                <Title>{cat.label}</Title>
                <Paragraph>${getCategoryTotal(cat.value).toFixed(2)}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        style={styles.fabList}
        icon="format-list-bulleted"
        onPress={() => navigation.navigate('Debts')}
        label="Ver Lista"
      />
      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
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
    paddingBottom: 100, // Make room for FABs
  },
  totalCard: {
    marginBottom: 20,
    backgroundColor: '#e3f2fd',
  },
  totalTitle: {
    textAlign: 'center',
    color: '#1565c0',
  },
  totalAmount: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
  },
  fabAdd: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabList: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
  },
});

export default HomeScreen;
