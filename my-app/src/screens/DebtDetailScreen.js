import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
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
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="bodyLarge">${debt.amount}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Vencimiento:</Text>
            <Text variant="bodyLarge">{debt.dueDate || 'No especificado'}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>
          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.descTitle}>Descripción:</Text>
          <Text variant="bodyMedium">{debt.description || 'Sin descripción'}</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => toggleDebtStatus(id)}
            style={styles.actionButton}
            buttonColor={debt.isPaid ? '#f0ad4e' : '#5cb85c'}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddEditDebtScreen', { id: debt.id })}
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode="contained"
            onPress={handleDelete}
            style={styles.actionButton}
            buttonColor="#d9534f"
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
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  descTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
