import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debts, payDebt, deleteDebt } = useDebts();
  const { debtId } = route?.params || {};

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handlePay = () => {
    payDebt(debt.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles de Deuda" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>{debt.title}</Title>
            <Paragraph style={styles.amount}>
              Monto: ${Number(debt.amount).toFixed(2)}
            </Paragraph>
            <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
            <Paragraph style={styles.detail}>
              Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Paragraph>
            <Paragraph style={styles.detail}>
              Fecha: {new Date(debt.createdAt).toLocaleDateString()}
            </Paragraph>
            {debt.description ? (
              <Paragraph style={styles.description}>
                Descripción: {debt.description}
              </Paragraph>
            ) : null}
          </Card.Content>
          <Card.Actions style={styles.actions}>
            {!debt.isPaid && (
              <Button
                mode="contained"
                onPress={handlePay}
                style={styles.payButton}
                testID="btn-pay"
              >
                Marcar como Pagada
              </Button>
            )}
            <Button
              mode="outlined"
              color="#d32f2f"
              onPress={handleDelete}
              testID="btn-delete"
            >
              Eliminar
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    color: '#d32f2f',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  payButton: {
    marginBottom: 8,
  },
});

export default DebtDetailsScreen;
