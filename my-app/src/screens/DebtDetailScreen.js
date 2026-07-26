import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, Card } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, toggleDebtStatus, deleteDebt } = useDebts();

  const debt = debts.find(d => d.id === id);

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

  const handleToggleStatus = async () => {
    await toggleDebtStatus(debt.id);
    // navigation.goBack(); // Optional: go back or stay to see the updated status
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title testID="detail-title">{debt.title}</Title>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Monto: ${debt.amount}</Paragraph>
          <Paragraph>Vencimiento: {debt.dueDate}</Paragraph>
          <Paragraph>Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
          {debt.description ? <Paragraph>Descripción: {debt.description}</Paragraph> : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleToggleStatus}
            style={styles.actionBtn}
            testID="toggle-status-btn"
          >
            {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
          </Button>
          <Button
            mode="outlined"
            color="red"
            onPress={handleDelete}
            style={styles.actionBtn}
            testID="delete-btn"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 20,
  },
  actionBtn: {
    marginBottom: 10,
  }
});

export default DebtDetailScreen;
