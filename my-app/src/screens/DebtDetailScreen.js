import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    Alert.alert(
      "Marcar como pagada",
      "¿Estás seguro de que deseas marcar esta deuda como pagada?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, pagada",
          onPress: async () => {
            await markAsPaid(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que deseas eliminar esta deuda permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(debt.id);
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
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={debt.isPaid ? styles.paidText : styles.unpaidText}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vencimiento:</Text>
              <Text style={styles.value}>{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.descriptionText}>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          {!debt.isPaid && (
            <Button
              mode="contained"
              onPress={handleMarkAsPaid}
              style={styles.actionButton}
              color="#4caf50"
            >
              Marcar Pagada
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            color="#f44336"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
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
    padding: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  paidText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  unpaidText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'column',
    marginTop: 16,
  },
  actionButton: {
    width: '100%',
    marginVertical: 4,
  },
});
