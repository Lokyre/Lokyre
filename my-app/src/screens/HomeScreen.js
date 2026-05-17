import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);
  const pendingDebt = totalDebt - totalPaid;

  const categories = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.centerText}>Resumen General</Title>
          <Paragraph style={[styles.centerText, styles.totalText]}>
            Deuda Total: ${totalDebt.toFixed(2)}
          </Paragraph>
          <Paragraph style={[styles.centerText, styles.paidText]}>
            Total Pagado: ${totalPaid.toFixed(2)}
          </Paragraph>
          <Paragraph style={[styles.centerText, styles.pendingText]}>
            Pendiente: ${pendingDebt.toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Categorías</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <Card
            key={category}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DebtList', { category })}
          >
            <Card.Content>
              <Title style={styles.centerText}>{category}</Title>
              <Paragraph style={styles.centerText}>
                {debts.filter((d) => d.category === category).length} deudas
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDebt')}
      >
        Añadir Nueva Deuda
      </Button>
      <Button
        mode="outlined"
        style={styles.allButton}
        onPress={() => navigation.navigate('DebtList')}
      >
        Ver Todas las Deudas
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
  summaryCard: {
    marginBottom: 24,
    elevation: 4,
  },
  centerText: {
    textAlign: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  paidText: {
    color: 'green',
    fontSize: 16,
  },
  pendingText: {
    color: 'red',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  allButton: {
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 8,
  }
});

export default HomeScreen;
