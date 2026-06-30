import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, toggleDebtPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleTogglePaid = () => {
    toggleDebtPaid(debt.id);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <Text variant="displaySmall" style={styles.amount}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Fecha de Vencimiento:</Text>
            <Text variant="bodyLarge">{debt.dueDate}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
              {debt.isPaid ? 'PAGADA' : 'PENDIENTE'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyMedium">{debt.description}</Text>
            </View>
          ) : null}

        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={styles.button}
          buttonColor={debt.isPaid ? '#f57c00' : '#4caf50'}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor="#d32f2f"
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
    color: '#d32f2f',
    marginVertical: 16,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    marginBottom: 16,
  }
});
