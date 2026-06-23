import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Appbar, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, toggleDebtStatus } = useDebts();

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
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
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles" />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate('AddEditDebt', { id })} testID="btn-edit" />
        <Appbar.Action icon="delete" onPress={handleDelete} testID="btn-delete" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>{debt.title}</Text>

            <View style={styles.row}>
              <Text variant="titleMedium">Monto:</Text>
              <Text variant="titleMedium" style={styles.amount}>${debt.amount}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="titleMedium">Estado:</Text>
              <Text variant="titleMedium" style={{ color: debt.isPaid ? 'green' : 'red' }}>
                {debt.isPaid ? 'Pagada' : 'Pendiente'}
              </Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="titleMedium">Tipo:</Text>
              <Text variant="bodyLarge">{debt.type}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="titleMedium">Vencimiento:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyMedium" style={styles.description}>
                {debt.description || 'Sin descripción.'}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => toggleDebtStatus(id)}
              buttonColor={debt.isPaid ? '#f57c00' : '#4caf50'}
              testID="btn-toggle-status"
            >
              {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  amount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    marginTop: 5,
    color: '#555',
  },
  actions: {
    justifyContent: 'center',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DebtDetailScreen;
