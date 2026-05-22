import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route.params;
  const { debts, removeDebt, togglePaid } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
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
            removeDebt(debt.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTogglePaid = () => {
    togglePaid(debt.id);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.detail}>
            Monto: ${debt.amount.toFixed(2)}
          </Paragraph>
          <Paragraph style={styles.detail}>
            Estado:{' '}
            <Text
              style={debt.isPaid ? styles.paidStatus : styles.pendingStatus}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </Paragraph>
          <Paragraph style={styles.date}>
            Creado el: {new Date(debt.createdAt).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            buttonColor={debt.isPaid ? '#f0ad4e' : '#5cb85c'}
            style={styles.actionButton}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            textColor="red"
            onPress={handleDelete}
            style={styles.actionButton}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  paidStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 20,
  },
  actionButton: {
    marginVertical: 5,
    width: '100%',
  },
});
