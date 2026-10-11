import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { debts, togglePaid, deleteDebt } = useDebts();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        deleteDebt(debt.id);
        navigation.goBack();
      }
    } else {
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
    }
  };

  const handleTogglePaid = () => {
    togglePaid(debt.id);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{debt.description}</Title>
            <Chip style={styles.chip}>{debt.category}</Chip>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.status, debt.paid ? styles.statusPaid : styles.statusPending]}>
              {debt.paid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Fecha de registro:</Text>
            <Text style={styles.date}>{new Date(debt.date).toLocaleDateString()}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={[styles.button, debt.paid ? styles.buttonUnpay : styles.buttonPay]}
          icon={debt.paid ? "close" : "check"}
        >
          {debt.paid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.deleteButton}
          textColor="#e53935"
          icon="delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    flex: 1,
    fontSize: 24,
    marginRight: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  amountContainer: {
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  dateContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusPending: {
    color: '#e53935',
  },
  statusPaid: {
    color: '#43a047',
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    gap: 16,
  },
  button: {
    paddingVertical: 6,
  },
  buttonPay: {
    backgroundColor: '#43a047',
  },
  buttonUnpay: {
    backgroundColor: '#fb8c00',
  },
  deleteButton: {
    borderColor: '#e53935',
    paddingVertical: 6,
  }
});
