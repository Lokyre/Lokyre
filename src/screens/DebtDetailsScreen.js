import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { Card, Text, Button, Chip, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const typeColors = {
  Tarjetas: '#ff9800',
  Créditos: '#2196f3',
  Personas: '#4caf50',
  Individuales: '#9c27b0',
};

const typeIcons = {
  Tarjetas: 'credit-card',
  Créditos: 'bank',
  Personas: 'account-group',
  Individuales: 'account',
};

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const [debt, setDebt] = useState(null);

  useEffect(() => {
    const currentDebt = debts.find((d) => d.id === debtId);
    if (!currentDebt) {
      navigation.goBack();
    } else {
      setDebt(currentDebt);
    }
  }, [debtId, debts, navigation]);

  if (!debt) return null;

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        deleteDebt(debtId);
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deleteDebt(debtId),
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
          <Text variant="displaySmall" style={styles.amount}>
            ${debt.amount.toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text variant="titleMedium" style={styles.label}>Título:</Text>
            <Text variant="bodyLarge">{debt.title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium" style={styles.label}>Categoría:</Text>
            <Chip
              icon={typeIcons[debt.type]}
              style={{ backgroundColor: typeColors[debt.type] + '20' }}
              textStyle={{ color: typeColors[debt.type] }}
            >
              {debt.type}
            </Chip>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium" style={styles.label}>Estado:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium" style={styles.label}>Fecha:</Text>
            <Text variant="bodyLarge">
              {new Date(debt.date).toLocaleDateString()}
            </Text>
          </View>

        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => toggleDebtStatus(debtId)}
            style={styles.actionButton}
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
          </Button>
          <View style={styles.bottomActions}>
            <Button
              mode="contained"
              icon="pencil"
              onPress={() => navigation.navigate('AddEditDebt', { debtId })}
              style={[styles.actionButton, { marginRight: 8 }]}
            >
              Editar
            </Button>
            <Button
              mode="contained-tonal"
              icon="delete"
              buttonColor="#ffebee"
              textColor="#d32f2f"
              onPress={handleDelete}
              style={styles.actionButton}
            >
              Eliminar
            </Button>
          </View>
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
    backgroundColor: '#fff',
  },
  amount: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#757575',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default DebtDetailsScreen;
