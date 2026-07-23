import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { debts, deleteDebt, togglePaid } = useDebts();

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.container}>
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
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleTogglePaid = async () => {
    await togglePaid(id);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title testID="detail-title">{debt.title}</Title>
          <Paragraph>Monto: ${debt.amount.toFixed(2)}</Paragraph>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Vencimiento: {debt.dueDate}</Paragraph>
          <Paragraph>Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
          {debt.description ? (
            <Paragraph>Descripción: {debt.description}</Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            style={styles.actionButton}
            testID="toggle-paid-button"
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
            style={styles.actionButton}
            testID="edit-button"
          >
            Editar
          </Button>
          <Button
            mode="outlined"
            color="red"
            onPress={handleDelete}
            style={styles.actionButton}
            testID="delete-button"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },
  actionButton: {
    marginBottom: 8,
  }
});
