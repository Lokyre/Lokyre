import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailsScreen() {
  const { debts, markAsPaid, deleteDebt } = useDebts();
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

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
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
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Categoría:</Text>
            <Text style={styles.value}>{debt.category}</Text>
          </View>
          {debt.dueDate ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha de Vencimiento:</Text>
              <Text style={styles.value}>{debt.dueDate}</Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {!debt.isPaid && (
        <Button
          mode="contained"
          onPress={handleMarkAsPaid}
          style={styles.button}
          color="green"
        >
          Marcar como Pagada
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={[styles.button, styles.deleteButton]}
        color="red"
      >
        Eliminar Deuda
      </Button>
    </View>
  );
}

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
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  deleteButton: {
    borderColor: 'red',
  }
});
