import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.containerCenter}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    markAsPaid(id);
    navigation.goBack();
  };

  const handleDelete = () => {
    deleteDebt(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.description}</Title>
          <View style={styles.chipContainer}>
            <Chip icon="tag" style={styles.chip}>{debt.type}</Chip>
            <Chip
              icon={debt.status === 'paid' ? 'check' : 'clock-outline'}
              style={debt.status === 'paid' ? styles.chipPaid : styles.chipPending}
              textStyle={{ color: 'white' }}
            >
              {debt.status === 'paid' ? 'Pagado' : 'Pendiente'}
            </Chip>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Fecha de Vencimiento:</Text>
            <Text style={styles.value}>{debt.dueDate}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {debt.status !== 'paid' && (
          <Button
            mode="contained"
            icon="check-circle"
            onPress={handleMarkAsPaid}
            style={styles.actionButton}
            buttonColor="#4caf50"
          >
            Marcar como Pagado
          </Button>
        )}
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleDelete}
          textColor="#f44336"
          style={styles.actionButton}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingVertical: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
  },
  chipPending: {
    backgroundColor: '#f44336',
  },
  chipPaid: {
    backgroundColor: '#4caf50',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 10,
  },
  actionButton: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});

export default DebtDetailScreen;
