import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleToggleStatus = () => {
    updateDebt({ ...debt, isPaid: !debt.isPaid });
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
        <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
        <Card.Content>
          <Text style={styles.info}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Text>
          <Text style={styles.info}>Vence: {debt.dueDate}</Text>
          <Text style={styles.info}>Descripción: {debt.description}</Text>
          <Text style={[styles.info, { color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }]}>
            Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button onPress={handleToggleStatus} mode="contained" buttonColor={debt.isPaid ? 'orange' : 'green'}>
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
          <Button onPress={handleDelete} mode="contained" buttonColor="red">
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 10 },
  info: { fontSize: 16, marginBottom: 8 },
  actions: { flexDirection: 'column', gap: 10, alignItems: 'stretch' }
});

export default DebtDetailScreen;
