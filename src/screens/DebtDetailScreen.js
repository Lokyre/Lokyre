import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debts, deleteDebt, togglePaid } = useDebts();
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
        deleteDebt(debt.id);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        "Eliminar deuda",
        "¿Estás seguro de que quieres eliminar esta deuda?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              deleteDebt(debt.id);
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={debt.isPaid ? styles.paidAmount : styles.pendingAmount}>
              ${Number(debt.amount).toFixed(2)}
            </Title>
            <View style={[styles.badge, debt.isPaid ? styles.paidBadge : styles.pendingBadge]}>
              <Text style={styles.badgeText}>
                {debt.isPaid ? 'Pagado' : 'Pendiente'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {new Date(debt.date).toLocaleString('es-ES')}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Descripción:</Text>
            <Paragraph style={styles.description}>{debt.description}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => togglePaid(debt.id)}
          style={[styles.button, debt.isPaid ? styles.pendingButton : styles.payButton]}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="red"
          style={styles.button}
        >
          Eliminar Deuda
        </Button>
      </View>
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
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pendingAmount: {
    fontSize: 32,
    color: 'red',
  },
  paidAmount: {
    fontSize: 32,
    color: 'green',
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pendingBadge: {
    backgroundColor: '#ffebee',
  },
  paidBadge: {
    backgroundColor: '#e8f5e9',
  },
  badgeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    marginTop: 4,
    color: '#333',
  },
  actions: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  payButton: {
    backgroundColor: '#4caf50',
  },
  pendingButton: {
    backgroundColor: '#ff9800',
  },
});

export default DebtDetailScreen;
