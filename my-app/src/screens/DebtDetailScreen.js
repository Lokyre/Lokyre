import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, deleteDebt, markAsPaid } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const debtId = route.params?.id;

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
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
          <Text variant="headlineSmall" style={styles.amount}>Monto: ${debt.amount}</Text>
          <Divider style={styles.divider} />
          <Text variant="bodyLarge">Vencimiento: {debt.dueDate}</Text>
          <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'red', marginVertical: 8 }}>
            Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
          {debt.description ? (
            <Text variant="bodyMedium">Descripción: {debt.description}</Text>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {!debt.isPaid && (
          <Button mode="contained" onPress={() => markAsPaid(debt.id)} style={styles.button} testID="mark-paid-button">
            Marcar como Pagada
          </Button>
        )}
        <Button mode="outlined" onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })} style={styles.button} testID="edit-button">
          Editar Deuda
        </Button>
        <Button mode="outlined" textColor="red" onPress={handleDelete} style={styles.button} testID="delete-button">
          Eliminar Deuda
        </Button>
      </View>
    </View>
  );
}

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
    marginBottom: 24,
  },
  amount: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  divider: {
    marginVertical: 12,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  }
});
