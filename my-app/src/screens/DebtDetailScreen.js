import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, togglePaidStatus } = useDebts();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
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

  const handleTogglePaid = async () => {
    await togglePaidStatus(debt.id);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.amount}>Monto: ${debt.amount.toFixed(2)}</Paragraph>
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.detail}>
            Estado: <Text style={{fontWeight: 'bold', color: debt.isPaid ? 'green' : 'red'}}>{debt.isPaid ? 'Pagado' : 'Pendiente'}</Text>
          </Paragraph>
          {debt.dueDate ? (
            <Paragraph style={styles.detail}>Vencimiento: {debt.dueDate}</Paragraph>
          ) : null}
          {debt.description ? (
            <Paragraph style={styles.description}>Descripción: {debt.description}</Paragraph>
          ) : null}
          <Paragraph style={styles.date}>
            Creado: {new Date(debt.createdAt).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            style={styles.actionButton}
            buttonColor={debt.isPaid ? '#757575' : '#4caf50'}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode="text"
            textColor="#f44336"
            onPress={handleDelete}
            style={styles.actionButton}
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
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
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
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
  date: {
    fontSize: 12,
    color: '#757575',
    marginTop: 16,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
    width: '100%',
  },
});

export default DebtDetailScreen;
