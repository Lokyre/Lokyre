import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { debts, togglePaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
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
            deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{debt.title}</Title>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Monto:</Text>
        <Text style={styles.value}>${debt.amount}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{debt.type}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
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
          <Paragraph style={styles.description}>{debt.description}</Paragraph>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => togglePaid(id)}
          style={[styles.button, { backgroundColor: debt.isPaid ? '#f57c00' : '#4caf50' }]}
          testID="btn-toggle-paid"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="#d32f2f"
          style={styles.deleteButton}
          testID="btn-delete"
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
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
  },
  descriptionContainer: {
    marginTop: 15,
    paddingVertical: 10,
  },
  description: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  actions: {
    marginTop: 40,
  },
  button: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  deleteButton: {
    borderColor: '#d32f2f',
  }
});
