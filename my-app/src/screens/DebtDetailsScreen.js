import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Text, Card, Button, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailsScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, markAsPaid, deleteDebt } = useDebts();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Detalles" />
        </Appbar.Header>
        <View style={styles.center}>
          <Text>Deuda no encontrada</Text>
        </View>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    Alert.alert('Confirmación', '¿Estás seguro de que deseas marcar esta deuda como pagada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, pagada',
        onPress: () => {
          markAsPaid(debt.id);
          navigation.goBack();
        }
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Deuda', '¿Estás seguro de que deseas eliminar esta deuda de forma permanente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteDebt(debt.id);
          navigation.goBack();
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles de la Deuda" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>{debt.title}</Text>
            <Text variant="titleLarge" style={styles.amount}>${debt.amount.toFixed(2)}</Text>

            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="labelLarge">Tipo:</Text>
              <Text variant="bodyLarge">{debt.type}</Text>
            </View>

            <View style={styles.row}>
              <Text variant="labelLarge">Estado:</Text>
              <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'orange' }}>
                {debt.isPaid ? 'Pagada' : 'Pendiente'}
              </Text>
            </View>

            {debt.dueDate ? (
              <View style={styles.row}>
                <Text variant="labelLarge">Vencimiento:</Text>
                <Text variant="bodyLarge">{debt.dueDate}</Text>
              </View>
            ) : null}

            {debt.description ? (
              <View style={styles.descriptionContainer}>
                <Text variant="labelLarge">Descripción:</Text>
                <Text variant="bodyMedium" style={styles.description}>{debt.description}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          {!debt.isPaid && (
            <Button
              mode="contained"
              onPress={handleMarkAsPaid}
              style={styles.actionButton}
              buttonColor="green"
            >
              Marcar como Pagada
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            textColor="red"
          >
            Eliminar Deuda
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    color: '#000',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    marginTop: 4,
    color: '#444',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
  },
});
