import React, { useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(debtId);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = async () => {
    await markAsPaid(debtId);
    Alert.alert('Éxito', 'Deuda marcada como pagada.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 8, color: debt.isPaid ? 'green' : 'red' }}>
            Monto: ${parseFloat(debt.amount).toFixed(2)}
          </Text>
          <Text variant="bodyMedium">Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}</Text>
          <Text variant="bodyMedium">Vencimiento: {debt.dueDate}</Text>

          {debt.description ? (
            <View style={{ marginTop: 12 }}>
              <Text variant="labelLarge">Descripción:</Text>
              <Text variant="bodyMedium">{debt.description}</Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            buttonColor="green"
            style={styles.button}
            onPress={handleMarkAsPaid}
            testID="btn-mark-paid"
          >
            Marcar como Pagada
          </Button>
        )}
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
          testID="btn-edit"
        >
          Editar Deuda
        </Button>
        <Button
          mode="contained"
          buttonColor="red"
          style={styles.button}
          onPress={handleDelete}
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
