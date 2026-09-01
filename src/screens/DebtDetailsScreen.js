import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailsScreen() {
  const { debts, deleteDebt, togglePaidStatus } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route?.params || {};
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

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.amount}>
            ${debt.amount}
          </Text>
          <Divider style={styles.divider} />

          <Text variant="bodyLarge">
            <Text style={styles.label}>Fecha: </Text>{debt.date}
          </Text>
          <Text variant="bodyLarge">
            <Text style={styles.label}>Estado: </Text>
            <Text style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </Text>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Text variant="bodyMedium">{debt.description}</Text>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            color={debt.isPaid ? 'orange' : 'green'}
            onPress={() => togglePaidStatus(debt.id)}
            style={styles.actionButton}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
          style={styles.editButton}
        >
          Editar
        </Button>
        <Button
          mode="contained"
          buttonColor="#d32f2f"
          icon="delete"
          onPress={handleDelete}
          style={styles.deleteButton}
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
    backgroundColor: '#f6f6f6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingBottom: 10,
  },
  amount: {
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  divider: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 15,
  },
  actions: {
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    width: '100%',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
  },
});