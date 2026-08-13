import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleToggleStatus = () => {
    const newStatus = debt.status === 'Pendiente' ? 'Pagado' : 'Pendiente';
    updateDebt(debt.id, { status: newStatus });
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <Title style={styles.amount}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Title>
          <Paragraph>
            Estado: <Text style={{ color: debt.status === 'Pagado' ? 'green' : 'red', fontWeight: 'bold' }}>{debt.status}</Text>
          </Paragraph>
          {debt.dueDate ? (
            <Paragraph>Vence: {debt.dueDate}</Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleToggleStatus}
            style={styles.actionBtn}
            testID="btn-toggle-status"
          >
            {debt.status === 'Pendiente' ? 'Marcar como Pagado' : 'Marcar como Pendiente'}
          </Button>
          <Button
            mode="outlined"
            color="red"
            onPress={handleDelete}
            style={styles.actionBtn}
            testID="btn-delete-debt"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 8,
  },
  amount: {
    fontSize: 32,
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  actionBtn: {
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
