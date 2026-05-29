import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;
  const { updateDebt, deleteDebt } = useContext(DebtContext);

  const handleMarkAsPaid = async () => {
    const updated = { ...debt, isPaid: true };
    await updateDebt(updated);
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
          <Title style={styles.title}>{debt.name}</Title>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${debt.amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value}>{debt.dueDate || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
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
          buttonColor="#4CAF50"
        >
          Marcar como Pagada
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={styles.button}
        textColor="red"
      >
        Eliminar Deuda
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 30, elevation: 4 },
  title: { fontSize: 28, marginBottom: 15, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  value: { fontSize: 18, color: '#333' },
  button: { marginBottom: 15, paddingVertical: 5 },
});
