import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, toggleDebtPaid } = useDebts();

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
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
          <Text variant="titleLarge" style={styles.detail}>Monto: ${debt.amount}</Text>
          <Text variant="bodyLarge" style={styles.detail}>Vencimiento: {debt.dueDate}</Text>
          <Text variant="bodyMedium" style={styles.detail}>Descripción: {debt.description || 'Sin descripción'}</Text>
          <Text
            variant="titleMedium"
            style={[styles.detail, { color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }]}
          >
            Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            testID="toggle-paid-button"
            mode="contained-tonal"
            onPress={() => toggleDebtPaid(id)}
          >
            Marcar como {debt.isPaid ? 'Pendiente' : 'Pagado'}
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          testID="edit-button"
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditDebt', { id })}
          style={styles.actionButton}
        >
          Editar
        </Button>
        <Button
          testID="delete-button"
          mode="contained"
          buttonColor="#d32f2f"
          icon="delete"
          onPress={handleDelete}
          style={styles.actionButton}
        >
          Eliminar
        </Button>
      </View>
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
    marginBottom: 20,
  },
  detail: {
    marginBottom: 10,
  },
  actions: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default DebtDetailsScreen;
