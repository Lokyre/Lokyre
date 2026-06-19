import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find(d => d.id === debtId);

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
        { text: "Eliminar", style: "destructive", onPress: () => {
          deleteDebt(debtId);
          navigation.goBack();
        }}
      ]
    );
  };

  const handleTogglePaid = () => {
    markAsPaid(debtId);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Cantidad:</Text>
            <Text variant="bodyLarge">${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text
              variant="bodyLarge"
              style={{ color: debt.isPaid ? 'green' : 'red' }}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {!!debt.dueDate && (
            <View style={styles.row}>
              <Text variant="titleMedium">Vencimiento:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
          )}

          {!!debt.description && (
            <View style={styles.column}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyMedium" style={styles.descriptionText}>{debt.description}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleTogglePaid}
        style={styles.button}
        buttonColor={debt.isPaid ? theme.colors.error : theme.colors.primary}
        testID="btn-toggle-paid"
      >
        {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
      </Button>

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={styles.button}
        textColor={theme.colors.error}
        testID="btn-delete"
      >
        Eliminar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  column: {
    marginTop: 8,
  },
  descriptionText: {
    marginTop: 4,
    color: '#555',
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
