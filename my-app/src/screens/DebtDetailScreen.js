import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Divider, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ navigation, route }) {
  const { debts, deleteDebt, togglePaidStatus } = useDebts();
  const theme = useTheme();
  const debtId = route.params?.id;

  const debt = debts.find(d => d.id === debtId);

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
            deleteDebt(debtId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Detalles" subtitle={debt.type} />
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>{debt.title}</Text>
          <Text variant="headlineMedium" style={{ color: debt.isPaid ? 'green' : theme.colors.error, marginVertical: 8 }}>
            ${debt.amount}
          </Text>

          <Divider style={styles.divider} />

          <Text variant="bodyLarge">Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}</Text>
          {debt.dueDate ? <Text variant="bodyLarge">Vencimiento: {debt.dueDate}</Text> : null}
          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Descripción:</Text>
              <Text variant="bodyMedium">{debt.description}</Text>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => togglePaidStatus(debt.id)}
            testID="toggle-status-button"
            style={{ flex: 1 }}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="pencil"
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
          testID="edit-button"
        >
          Editar
        </Button>
        <Button
          mode="contained"
          icon="delete"
          buttonColor={theme.colors.error}
          style={styles.actionButton}
          onPress={handleDelete}
          testID="delete-button"
        >
          Eliminar
        </Button>
      </View>
    </ScrollView>
  );
}

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
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  descriptionContainer: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
  }
});
