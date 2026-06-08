import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Appbar, Button, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, deleteDebt, togglePaid } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const { debtId } = route.params;
  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Detalles" />
        </Appbar.Header>
        <Text style={styles.notFound}>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
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
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles de la Deuda" />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Monto: $${debt.amount}`} />
        <Card.Content>
          <Text style={styles.detailText}>Tipo: {debt.type}</Text>
          <Text style={styles.detailText}>Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Text>
          {debt.dueDate ? <Text style={styles.detailText}>Vence: {debt.dueDate}</Text> : null}
          {debt.description ? <Text style={styles.detailText}>Descripción: {debt.description}</Text> : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          buttonColor={debt.isPaid ? '#f44336' : '#4caf50'}
          onPress={() => togglePaid(debt.id)}
          style={styles.button}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { margin: 16 },
  detailText: { fontSize: 16, marginTop: 8 },
  actions: { padding: 16 },
  button: { paddingVertical: 5 },
  notFound: { textAlign: 'center', marginTop: 50, fontSize: 18 }
});

export default DebtDetailScreen;