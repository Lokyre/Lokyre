import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró la deuda.</Text>
      </View>
    );
  }

  const handleTogglePaid = () => {
    updateDebt({ ...debt, isPaid: !debt.isPaid });
  };

  const handleDelete = () => {
    // Note: Alert does not work on Web. Using a simple delete for now, but
    // normally we would show a confirmation prompt here.
    deleteDebt(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Entidad/Persona: </Text>
            {debt.entity}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Monto: </Text>${debt.amount}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Tipo: </Text>
            {debt.type === 'credit_card'
              ? 'Tarjeta de Crédito'
              : debt.type === 'loan'
              ? 'Préstamo'
              : 'Personal'}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Estado: </Text>
            {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Relación: </Text>
            {debt.isOwedToMe ? 'Me deben' : 'Debo'}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            buttonColor={debt.isPaid ? 'orange' : 'green'}
          >
            {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
          </Button>
          <Button
            mode="contained"
            onPress={handleDelete}
            buttonColor="red"
            style={{ marginTop: 10 }}
          >
            Eliminar Deuda
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

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
    padding: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
});

export default DebtDetailScreen;
