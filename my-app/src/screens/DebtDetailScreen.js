import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, togglePaidStatus, deleteDebt } = useDebts();

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.amount}>
            Monto: ${parseFloat(debt.amount).toFixed(2)}
          </Paragraph>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Vencimiento: {debt.dueDate || 'N/A'}</Paragraph>
          {!!debt.description && (
            <Paragraph style={styles.description}>
              Nota: {debt.description}
            </Paragraph>
          )}
          <Paragraph style={[styles.status, { color: debt.isPaid ? 'green' : 'red' }]}>
            Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          buttonColor={debt.isPaid ? '#f57c00' : '#388e3c'}
          onPress={() => togglePaidStatus(id)}
          style={styles.button}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="contained"
          buttonColor="#1976d2"
          onPress={() => navigation.navigate('AddEditDebt', { id })}
          style={styles.button}
        >
          Editar Deuda
        </Button>

        <Button
          mode="contained"
          buttonColor="#d32f2f"
          onPress={handleDelete}
          style={styles.button}
        >
          Eliminar Deuda
        </Button>
      </View>
    </View>
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
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  status: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default DebtDetailScreen;
