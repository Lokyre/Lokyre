import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, deleteDebt, togglePaidStatus } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const id = route.params?.id;
  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
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
          onPress: async () => {
            await deleteDebt(id);
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
          <Paragraph style={styles.amount}>Monto: ${debt.amount}</Paragraph>
          <Paragraph>Tipo: {debt.type}</Paragraph>
          <Paragraph>Vencimiento: {debt.dueDate || 'No especificado'}</Paragraph>
          <Paragraph>Descripción: {debt.description || 'Sin descripción'}</Paragraph>
          <Paragraph style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold', marginTop: 10 }}>
            Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => togglePaidStatus(id)}
            style={[styles.button, { backgroundColor: debt.isPaid ? '#f57c00' : '#4caf50' }]}
            testID="toggle-paid-button"
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
            style={styles.button}
            testID="edit-button"
          >
            Editar
          </Button>
          <Button
            mode="text"
            textColor="red"
            onPress={handleDelete}
            style={styles.button}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 20,
    color: '#d32f2f',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default DebtDetailScreen;
