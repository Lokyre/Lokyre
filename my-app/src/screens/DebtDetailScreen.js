import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

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
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.amount}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Vencimiento: {new Date(debt.dueDate).toLocaleDateString()}</Paragraph>
          <Paragraph>Estado: <Text style={{ color: debt.isPaid ? 'green' : 'red' }}>{debt.isPaid ? 'Pagado' : 'Pendiente'}</Text></Paragraph>
          {debt.description ? (
            <Paragraph style={styles.description}>Descripción: {debt.description}</Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => toggleDebtStatus(debt.id)}
            buttonColor={debt.isPaid ? "#ff9800" : "#4caf50"}
            style={styles.actionBtn}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor="#f44336"
            style={styles.actionBtn}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
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
  description: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#555',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },
  actionBtn: {
    marginVertical: 4,
    width: '100%',
  }
});

export default DebtDetailScreen;
