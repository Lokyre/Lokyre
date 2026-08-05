import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, togglePaid, deleteDebt } = useContext(DebtContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { debtId } = route.params;

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la deuda.</Text>
      </View>
    );
  }

  const handleTogglePaid = async () => {
    await togglePaid(debt.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(debt.id);
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

          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Paragraph style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Paragraph style={styles.value}>{debt.type}</Paragraph>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Paragraph style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Paragraph>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Fecha:</Text>
            <Paragraph style={styles.value}>
              {new Date(debt.createdAt).toLocaleDateString()}
            </Paragraph>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            style={[styles.button, { backgroundColor: debt.isPaid ? '#f0ad4e' : '#5cb85c' }]}
            testID="btn-toggle-paid"
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            color="red"
            onPress={handleDelete}
            style={styles.button}
            testID="btn-delete"
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'column',
    padding: 16,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  }
});
