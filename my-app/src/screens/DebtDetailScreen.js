import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, updateDebt, deleteDebt } = useContext(DebtContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { debtId } = route.params;

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return <View style={styles.container}><Title>Deuda no encontrada</Title></View>;
  }

  const handleMarkAsPaid = () => {
    updateDebt(debtId, { isPaid: true });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Deuda', '¿Estás seguro que deseas eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        deleteDebt(debtId);
        navigation.goBack();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title testID="detail-title">{debt.title}</Title>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Monto: ${debt.amount}</Paragraph>
          <Paragraph>Vence: {debt.dueDate}</Paragraph>
          <Paragraph>Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
          {debt.description ? <Paragraph>Descripción: {debt.description}</Paragraph> : null}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('AddEditDebt', { debtId })} testID="edit-button">Editar</Button>
          {!debt.isPaid && <Button onPress={handleMarkAsPaid} testID="pay-button">Pagar</Button>}
          <Button onPress={handleDelete} color="red" testID="delete-button">Eliminar</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 8,
  }
});
