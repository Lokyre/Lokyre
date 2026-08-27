import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);

  const { debtId } = route?.params || {};
  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Title>Deuda no encontrada.</Title>
      </View>
    );
  }

  const handleMarkAsPaid = async () => {
    Alert.alert(
      'Confirmar pago',
      '¿Estás seguro de marcar esta deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, pagar',
          onPress: async () => {
            await markAsPaid(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de eliminar esta deuda? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>Monto: ${Number(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph style={styles.detail}>Tipo: {debt.type}</Paragraph>
          <Paragraph style={styles.detail}>Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
          {debt.description ? (
            <Paragraph style={styles.detail}>Descripción: {debt.description}</Paragraph>
          ) : null}
          <Paragraph style={styles.date}>
            Creado: {new Date(debt.createdAt).toLocaleDateString()}
          </Paragraph>
          {debt.paidAt && (
            <Paragraph style={styles.date}>
              Pagado el: {new Date(debt.paidAt).toLocaleDateString()}
            </Paragraph>
          )}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          {!debt.isPaid && (
            <Button mode="contained" onPress={handleMarkAsPaid} testID="btn-pay">
              Marcar Pagado
            </Button>
          )}
          <Button mode="outlined" color="red" onPress={handleDelete} testID="btn-delete">
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  actions: {
    justifyContent: 'space-around',
    marginTop: 16,
    paddingBottom: 8,
  },
});

export default DebtDetailScreen;
