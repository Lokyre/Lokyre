import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function DebtDetailsScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, markAsPaid } = useDebtContext();
  const theme = useTheme();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
        deleteDebt(debtId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        "Eliminar Deuda",
        "¿Estás seguro de que quieres eliminar esta deuda?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              deleteDebt(debtId);
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  const handleMarkAsPaid = () => {
      markAsPaid(debtId);
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.description} subtitle={`Categoría: ${debt.category}`} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.amount}>
            ${debt.amount}
          </Text>
          <Text variant="bodyMedium">
            Estado: {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            Añadida el: {new Date(debt.dateAdded).toLocaleDateString()}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          {!debt.isPaid && (
            <Button mode="contained" onPress={handleMarkAsPaid} style={styles.actionButton}>
              Marcar como Pagada
            </Button>
          )}
          <Button mode="outlined" textColor={theme.colors.error} onPress={handleDelete} style={styles.actionButton}>
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
    backgroundColor: '#fff',
  },
  card: {
    padding: 8,
  },
  amount: {
    marginVertical: 16,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 8,
    color: '#666',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 8,
  }
});
