import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Divider, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export const DebtDetailsScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, togglePaid, deleteDebt } = useDebts();
  const theme = useTheme();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigation.goBack();
  };

  const getTypeName = () => {
    switch (debt.type) {
      case 'tarjeta':
        return 'Tarjeta de Crédito';
      case 'credito':
        return 'Crédito / Préstamo';
      case 'persona':
        return 'Persona';
      default:
        return 'Individual / Otros';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {debt.title}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text
              variant="titleLarge"
              style={{ color: debt.isPaid ? theme.colors.primary : theme.colors.error, fontWeight: 'bold' }}
            >
              ${Number(debt.amount).toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text
              variant="titleMedium"
              style={{ color: debt.isPaid ? theme.colors.primary : theme.colors.error, fontWeight: 'bold' }}
            >
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Tipo:</Text>
            <Text variant="bodyLarge">{getTypeName()}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Fecha:</Text>
            <Text variant="bodyLarge">{new Date(debt.date).toLocaleDateString()}</Text>
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
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => togglePaid(debt.id)}
            style={styles.actionButton}
            buttonColor={debt.isPaid ? theme.colors.error : theme.colors.primary}
          >
            {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            textColor={theme.colors.error}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionText: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    marginTop: 8,
  },
});
