import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Title, Paragraph, Button, Divider, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailsScreen() {
  const { toggleDebtPaid, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  // Safe default in case navigating without debt
  const initialDebt = route.params?.debt || {};
  // Local state to reflect instant change, since context update might trigger re-render
  // at home but we want instant feedback here.
  const [debt, setDebt] = useState(initialDebt);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await toggleDebtPaid(debt.id);
      setDebt({ ...debt, isPaid: !debt.isPaid });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda de forma permanente?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDebt(debt.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la deuda.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!debt.id) {
    return (
      <View style={styles.centered}>
        <Text>Error: No se encontró la deuda.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title testID="detail-title">{debt.title}</Title>
            {debt.isPaid ? (
              <Chip icon="check-circle" style={styles.chipPaid}>Pagada</Chip>
            ) : (
              <Chip icon="clock-outline" style={styles.chipPending}>Pendiente</Chip>
            )}
          </View>

          <Text style={[styles.amount, { color: debt.isPaid ? 'green' : 'red' }]} testID="detail-amount">
            Monto: ${parseFloat(debt.amount).toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value} testID="detail-type">{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value} testID="detail-duedate">{debt.dueDate || 'No especificado'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Creado el:</Text>
            <Text style={styles.value}>
              {debt.createdAt ? new Date(debt.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.label}>Descripción:</Text>
          <Paragraph testID="detail-description">{debt.description || 'Sin descripción'}</Paragraph>

        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          loading={loading}
          disabled={loading}
          style={styles.actionButton}
          buttonColor={debt.isPaid ? "#ff9800" : "#4caf50"}
          testID="btn-toggle"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          loading={loading}
          disabled={loading}
          style={styles.actionButton}
          buttonColor="#f44336"
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    flex: 1,
  },
  chipPaid: {
    backgroundColor: '#c8e6c9',
  },
  chipPending: {
    backgroundColor: '#ffcdd2',
  },
  actions: {
    paddingBottom: 40,
  },
  actionButton: {
    marginBottom: 15,
    paddingVertical: 5,
  },
});
