import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Divider, IconButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, toggleDebtStatus } = useDebts();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la deuda.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteDebt(debtId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={debt.title}
          subtitle={`Tipo: ${debt.type}`}
          right={(props) => (
            <View style={styles.actionRow}>
              <IconButton
                {...props}
                icon="pencil"
                onPress={() => navigation.navigate('AddEditDebt', { debtId })}
                testID="edit-icon"
              />
              <IconButton
                {...props}
                icon="delete"
                color="#d32f2f"
                onPress={handleDelete}
                testID="delete-icon"
              />
            </View>
          )}
        />
        <Divider />
        <Card.Content style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.status, debt.status === 'pagado' ? styles.statusPaid : styles.statusPending]}>
              {debt.status.toUpperCase()}
            </Text>
          </View>

          {!!debt.dueDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Vencimiento:</Text>
              <Text style={styles.value}>{debt.dueDate}</Text>
            </View>
          )}

          {!!debt.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.description}>{debt.description}</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={[styles.toggleButton, debt.status === 'pagado' ? styles.bgPending : styles.bgPaid]}
        onPress={() => toggleDebtStatus(debtId)}
        testID="toggle-status-button"
      >
        {debt.status === 'pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
      </Button>
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
    marginBottom: 24,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
  },
  content: {
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusPending: {
    color: '#d32f2f',
  },
  statusPaid: {
    color: '#388e3c',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    marginTop: 4,
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    paddingVertical: 8,
  },
  bgPaid: {
    backgroundColor: '#4caf50',
  },
  bgPending: {
    backgroundColor: '#ff9800',
  },
});

export default DebtDetailScreen;
