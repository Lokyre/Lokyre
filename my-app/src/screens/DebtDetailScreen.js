import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { debts, markAsPaid, deleteDebt } = useDebts();

  const { debtId } = route.params;
  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de marcar esta deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            markAsPaid(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de eliminar esta deuda permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Tipo: ${debt.type}`} />
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="titleLarge" style={styles.amount}>${debt.amount}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Vencimiento:</Text>
            <Text variant="bodyLarge">{debt.dueDate}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'red' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <>
              <Divider style={styles.divider} />
              <View style={styles.descContainer}>
                <Text variant="titleMedium">Descripción:</Text>
                <Text variant="bodyMedium" style={styles.descText}>{debt.description}</Text>
              </View>
            </>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.button}
            buttonColor="green"
            testID="btn-pay"
          >
            Marcar como Pagada
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor="red"
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  amount: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  descContainer: {
    marginVertical: 8,
  },
  descText: {
    marginTop: 4,
    color: '#555',
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 6,
  },
});

export default DebtDetailScreen;
