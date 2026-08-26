import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Title, Paragraph, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params || {};
  const { debts, removeDebt, markAsPaid } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Eliminar Deuda', '¿Estás seguro de que deseas eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          removeDebt(debt.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.name}</Title>
          <Paragraph style={styles.detail}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph style={styles.detail}>Categoría: {debt.category}</Paragraph>
          <Paragraph style={styles.detail}>Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
          {debt.dueDate && <Paragraph style={styles.detail}>Vence: {debt.dueDate}</Paragraph>}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button mode="contained" onPress={handleMarkAsPaid} style={styles.button} testID="btn-mark-paid">
            Marcar como Pagada
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddEditDebt', { debt })}
          style={styles.button}
          testID="btn-edit"
        >
          Editar
        </Button>
        <Button mode="text" color="red" onPress={handleDelete} style={styles.button} testID="btn-delete">
          Eliminar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    marginTop: 20,
  },
  button: {
    marginBottom: 15,
  },
});

export default DebtDetailScreen;
