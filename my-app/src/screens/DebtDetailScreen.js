import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debts, toggleDebtStatus, deleteDebt } = useContext(DebtContext);
  const { id } = route.params;

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(id);
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
        <Divider />
        <Card.Content style={styles.content}>
          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="headlineSmall">${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text variant="titleMedium" style={{ color: debt.isPaid ? 'green' : 'orange' }}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Vencimiento:</Text>
            <Text variant="bodyLarge">{debt.dueDate || 'No especificado'}</Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyMedium" style={styles.descriptionText}>
                {debt.description}
              </Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => toggleDebtStatus(id)}
          style={styles.button}
          buttonColor={debt.isPaid ? '#ff9800' : '#4caf50'}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddEditDebt', { id })}
          style={styles.button}
        >
          Editar Deuda
        </Button>

        <Button
          mode="outlined"
          textColor="red"
          onPress={handleDelete}
          style={styles.button}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  content: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    marginTop: 4,
    color: '#666',
  },
  actions: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
