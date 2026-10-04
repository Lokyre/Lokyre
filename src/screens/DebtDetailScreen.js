import React, { useContext } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centerContainer}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta deuda?');
      if (confirmDelete) {
        deleteDebt(debtId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Eliminar deuda',
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
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Detalles de la Deuda" />
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Descripción:</Text>
            <Text variant="bodyLarge">{debt.description}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="titleMedium">Categoría:</Text>
            <Text variant="bodyLarge">{debt.type}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="titleMedium">Fecha:</Text>
            <Text variant="bodyLarge">{new Date(debt.date).toLocaleDateString()}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.goBack()}
          >
            Volver
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={handleDelete}
          >
            Eliminar
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  actions: {
    marginTop: 16,
    justifyContent: 'flex-end',
  },
});

export default DebtDetailScreen;
