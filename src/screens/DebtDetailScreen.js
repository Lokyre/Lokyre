import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Text, Card } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, toggleDebtStatus } = useDebts();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe o fue eliminada.</Text>
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
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>

          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${debt.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.label}>Notas:</Text>
              <Paragraph>{debt.notes}</Paragraph>
            </View>
          ) : null}

          <Text style={styles.date}>
            Agregada: {new Date(debt.dateAdded).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => toggleDebtStatus(debt.id)}
          style={[styles.button, { backgroundColor: debt.isPaid ? '#ff9800' : '#4caf50' }]}
        >
          Marcar como {debt.isPaid ? 'Pendiente' : 'Pagada'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="red"
          style={styles.button}
        >
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#fff9c4',
    borderRadius: 8,
  },
  date: {
    marginTop: 16,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  actions: {
    marginTop: 20,
  },
  button: {
    marginBottom: 16,
  },
});
