import React, { useContext } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar deuda",
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
          <Paragraph style={styles.detail}>Monto: ${debt.amount}</Paragraph>
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.detail}>
            Estado: <Text style={{ color: debt.isPaid ? 'green' : 'red' }}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </Paragraph>
          {debt.description ? (
            <Paragraph style={styles.detail}>Descripción: {debt.description}</Paragraph>
          ) : null}
          <Paragraph style={styles.detail}>
            Fecha de creación: {new Date(debt.createdAt).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => toggleDebtStatus(debt.id)}
          style={[styles.button, { backgroundColor: debt.isPaid ? '#f44336' : '#4caf50' }]}
          testID="btn-toggle-status"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
          style={styles.button}
          testID="btn-edit"
        >
          Editar
        </Button>

        <Button
          mode="text"
          textColor="red"
          onPress={handleDelete}
          style={styles.button}
          testID="btn-delete"
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default DebtDetailScreen;