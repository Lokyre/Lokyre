import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Text, Button, Card, Divider } from 'react-native-paper';
import { DebtContext } from './DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Detalle" />
        </Appbar.Header>
        <Text style={styles.errorText}>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    if (globalThis.alert) {
      // web mock or simple confirm for web
      deleteDebt(debt.id);
      navigation.goBack();
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              deleteDebt(debt.id);
              navigation.goBack();
            }
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle de Deuda" />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })} testID="edit-debt-action" />
        <Appbar.Action icon="delete" onPress={handleDelete} testID="delete-debt-action" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>{debt.name}</Text>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="titleMedium" style={styles.label}>Monto:</Text>
              <Text variant="titleMedium" style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <Text variant="titleMedium" style={styles.label}>Tipo:</Text>
              <Text variant="bodyLarge">{debt.type}</Text>
            </View>

            <View style={styles.row}>
              <Text variant="titleMedium" style={styles.label}>Fecha:</Text>
              <Text variant="bodyLarge">{new Date(debt.createdAt).toLocaleDateString()}</Text>
            </View>

            {debt.description ? (
              <View style={styles.descriptionContainer}>
                <Text variant="titleMedium" style={styles.label}>Descripción:</Text>
                <Text variant="bodyMedium" style={styles.descriptionText}>{debt.description}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      </View>
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
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#666',
  },
  amount: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'red',
  }
});

export default DebtDetailScreen;
