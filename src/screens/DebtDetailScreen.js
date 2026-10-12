import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handlePay = () => {
    deleteDebt(debtId);
    if(globalThis.alert) {
      globalThis.alert('¡Deuda marcada como pagada y eliminada!');
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    deleteDebt(debtId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.description}</Title>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${debt.amount.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha de registro:</Text>
            <Text style={styles.value}>
              {new Date(debt.date).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button mode="outlined" onPress={handleDelete} color="red">
            Eliminar
          </Button>
          <Button mode="contained" onPress={handlePay}>
            Marcar Pagada
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  actions: {
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default DebtDetailScreen;
