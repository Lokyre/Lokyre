import React, { useContext } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, markPaid } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMarkPaid = () => {
    markPaid(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.amount}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.detail}>Vencimiento: {debt.dueDate}</Paragraph>
          <Paragraph style={styles.detail}>
            Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Paragraph>
          {debt.description ? (
            <Paragraph style={styles.description}>
              Descripción: {debt.description}
            </Paragraph>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkPaid}
            style={styles.button}
            buttonColor="#4caf50"
            testID="mark-paid-button"
          >
            Marcar como Pagada
          </Button>
        )}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('DebtForm', { id: debt.id })}
          style={styles.button}
          buttonColor="#2196f3"
          testID="edit-button"
        >
          Editar
        </Button>
        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#f44336"
          testID="delete-button"
        >
          Eliminar
        </Button>
      </View>
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
    marginBottom: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  amount: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default DebtDetailScreen;
