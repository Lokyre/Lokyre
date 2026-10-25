import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Button, Card, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { getDebts, updateDebt, deleteDebt } from '../utils/storage';

export default function DebtDetailScreen({ route, navigation }) {
  const { debtId } = route?.params || {};
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebt = async () => {
      if (!debtId) return;
      const allDebts = await getDebts();
      const found = allDebts.find(d => d.id === debtId);
      setDebt(found);
      setLoading(false);
    };
    fetchDebt();
  }, [debtId]);

  const handleMarkPaid = async () => {
    try {
      await updateDebt(debtId, { status: 'paid' });
      setDebt(prev => ({ ...prev, status: 'paid' }));
    } catch (error) {
      console.error('Error updating debt:', error);
    }
  };

  const executeDelete = async () => {
    try {
      await deleteDebt(debtId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        executeDelete();
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: executeDelete }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text variant="titleMedium">No se encontró la deuda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>{debt.description}</Text>
          <Text variant="headlineMedium" style={styles.amount}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>Tipo:</Text>
            <Chip icon="tag">{debt.type}</Chip>
          </View>

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>Estado:</Text>
            <Chip
              icon={debt.status === 'paid' ? 'check-circle' : 'clock-outline'}
              style={{ backgroundColor: debt.status === 'paid' ? '#d4edda' : '#fff3cd' }}
              textStyle={{ color: debt.status === 'paid' ? '#155724' : '#856404' }}
            >
              {debt.status === 'paid' ? 'Pagado' : 'Pendiente'}
            </Chip>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.dateLabel}>Fecha de creación:</Text>
            <Text variant="bodyMedium">
              {new Date(debt.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {debt.status !== 'paid' && (
          <Button
            mode="contained"
            onPress={handleMarkPaid}
            style={styles.button}
            buttonColor="#28a745"
            testID="mark-paid-button"
          >
            Marcar como Pagada
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor="#dc3545"
          testID="delete-button"
        >
          Eliminar Deuda
        </Button>
      </View>
    </View>
  );
}

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
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  amount: {
    color: '#dc3545',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
  },
  dateLabel: {
    color: '#666',
  },
  actions: {
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  }
});
