import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { getDebt, deleteDebt } = useDebts();
  const [debt, setDebt] = useState(null);

  useEffect(() => {
    const fetchedDebt = getDebt(debtId);
    if (fetchedDebt) {
      setDebt(fetchedDebt);
    } else {
      navigation.goBack();
    }
  }, [debtId, getDebt]);

  if (!debt) return null;

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>{debt.title}</Text>

          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="titleLarge" style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Tipo:</Text>
            <Text variant="bodyLarge">{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Fecha de Vencimiento:</Text>
            <Text variant="bodyLarge">{debt.dueDate}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })}
            testID="edit-button"
          >
            Editar
          </Button>
          <Button
            mode="contained"
            buttonColor="#d32f2f"
            onPress={handleDelete}
            testID="delete-button"
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
  card: {
    padding: 8,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 16,
    justifyContent: 'flex-end',
  }
});

export default DebtDetailScreen;
