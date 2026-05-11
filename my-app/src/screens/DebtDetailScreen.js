import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;
  const { deleteDebt } = useContext(DebtContext);

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
            deleteDebt(debt.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
    // For simplicity, treating "paid" as deleting from the active list.
    Alert.alert(
      'Marcar como Pagada',
      '¿Deseas marcar esta deuda como pagada y eliminarla de la lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            deleteDebt(debt.id);
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
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.amount}>Monto: ${debt.amount}</Paragraph>
          <Paragraph style={styles.detail}>Vencimiento: {debt.dueDate}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditDebt', { debt })}
          style={styles.button}
        >
          Editar
        </Button>
        <Button
          mode="contained"
          icon="check"
          color="#4CAF50"
          onPress={handleMarkAsPaid}
          style={[styles.button, styles.paidButton]}
        >
          Marcar Pagada
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          color="#f44336"
          onPress={handleDelete}
          style={styles.button}
        >
          Eliminar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginTop: 5,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginVertical: 10,
  },
  paidButton: {
    backgroundColor: '#4CAF50',
  },
});
