import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleMarkAsPaid = async () => {
    await markAsPaid(debt.id);
    Alert.alert('Éxito', 'La deuda ha sido marcada como pagada');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detailText}><Text style={styles.bold}>Tipo:</Text> {debt.type}</Paragraph>
          <Paragraph style={styles.detailText}><Text style={styles.bold}>Monto:</Text> ${debt.amount}</Paragraph>
          <Paragraph style={styles.detailText}><Text style={styles.bold}>Estado:</Text> {debt.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>

          {debt.dueDate ? (
            <Paragraph style={styles.detailText}><Text style={styles.bold}>Vencimiento:</Text> {debt.dueDate}</Paragraph>
          ) : null}

          {debt.description ? (
            <Paragraph style={styles.detailText}><Text style={styles.bold}>Descripción:</Text> {debt.description}</Paragraph>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button mode="contained" onPress={handleMarkAsPaid} style={styles.button} buttonColor="#4caf50">
            Marcar como Pagado
          </Button>
        )}
        <Button mode="outlined" onPress={handleDelete} style={styles.button} textColor="#d32f2f">
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
  center: {
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
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
  },
});
