import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Appbar } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, toggleDebtPaidStatus } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
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
            deleteDebt(debtId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleToggleStatus = () => {
    toggleDebtPaidStatus(debtId);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle de Deuda" />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate('AddEditDebt', { debtId })} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Monto:</Text>
              <Text variant="titleMedium">${debt.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vencimiento:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Estado:</Text>
              <Text variant="bodyLarge" style={debt.isPaid ? styles.paidText : styles.unpaidText}>
                {debt.isPaid ? 'Pagada' : 'Pendiente'}
              </Text>
            </View>
            {debt.description ? (
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>Descripción:</Text>
                <Text variant="bodyMedium">{debt.description}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          buttonColor={debt.isPaid ? "#f44336" : "#4CAF50"}
          onPress={handleToggleStatus}
          style={styles.actionButton}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paidText: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaidText: {
    color: 'red',
    fontWeight: 'bold',
  },
  actionButton: {
    paddingVertical: 8,
  },
});

export default DebtDetailScreen;
