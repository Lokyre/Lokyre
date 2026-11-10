import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, List } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => {
    return debt.status !== 'pagado' ? sum + parseFloat(debt.amount || 0) : sum;
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Deuda Total Pendiente</Title>
            <Paragraph style={styles.totalAmount}>
              ${totalDebt.toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Categorías</Text>

        {CATEGORIES.map((category) => (
          <List.Item
            key={category}
            title={category}
            left={props => <List.Icon {...props} icon="folder" />}
            onPress={() => navigation.navigate('DebtList', { category })}
            style={styles.listItem}
          />
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Nueva Deuda"
        testID="add-debt-fab"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

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
    marginBottom: 20,
    elevation: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 4,
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
