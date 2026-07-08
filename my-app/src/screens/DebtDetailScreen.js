import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, updateDebt, deleteDebt } = useDebts();

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Paragraph>Deuda no encontrada.</Paragraph>
      </View>
    );
  }

  const handleToggleStatus = () => {
    updateDebt(id, { isPaid: !debt.isPaid });
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title testID="detail-title">{debt.title}</Title>
          <Paragraph testID="detail-amount">Monto: ${debt.amount}</Paragraph>
          <Paragraph testID="detail-type">Tipo: {debt.type}</Paragraph>
          <Paragraph testID="detail-duedate">Vencimiento: {debt.dueDate}</Paragraph>
          <Paragraph testID="detail-description">Descripción: {debt.description}</Paragraph>
          <Paragraph testID="detail-status">Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleToggleStatus}
            style={styles.button}
            buttonColor={debt.isPaid ? "#f44336" : "#4CAF50"}
            testID="toggle-status-button"
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.button}
            textColor="#f44336"
            testID="delete-button"
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 8,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export default DebtDetailScreen;
