import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, markAsPaid, deleteDebt } = useDebtContext();

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    markAsPaid(id);
    navigation.goBack();
  };

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
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{debt.title}</Title>
          <Paragraph>Monto: ${debt.amount}</Paragraph>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          {debt.dueDate ? <Paragraph>Vencimiento: {debt.dueDate}</Paragraph> : null}
          {debt.description ? <Paragraph>Descripción: {debt.description}</Paragraph> : null}
          <Paragraph style={styles.status}>
            Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.button}
          >
            Marcar como Pagado
          </Button>
        )}
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
  status: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default DebtDetailScreen;
