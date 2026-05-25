import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts } = useDebts();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>Resumen de Deudas</Text>
          <Text variant="displayMedium" style={styles.total}>
            ${totalDebt.toFixed(2)}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Total de deudas pendientes ({debts.length})
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('DebtList')}
          style={styles.button}
          icon="format-list-bulleted"
        >
          Ver Deudas
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddDebt')}
          style={styles.button}
          icon="plus"
          buttonColor="#03dac6"
        >
          Agregar Deuda
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 32,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  total: {
    textAlign: 'center',
    color: '#b00020',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
});
