import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useDebt } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, markAsPaid, deleteDebt } = useDebt();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleTogglePaid = () => {
    markAsPaid(debt.id, !debt.isPaid);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={`Monto: $${debt.amount}`} />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Chip>{debt.type}</Chip>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado:</Text>
            <Chip
              style={debt.isPaid ? styles.paidChip : styles.unpaidChip}
              textStyle={debt.isPaid ? styles.paidText : styles.unpaidText}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Chip>
          </View>

          {debt.dueDate ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Vencimiento:</Text>
              <Text>{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.description}>{debt.description}</Text>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            buttonColor={debt.isPaid ? '#f57c00' : '#4caf50'}
            onPress={handleTogglePaid}
            style={styles.actionButton}
          >
            {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
          </Button>
          <Button
            mode="outlined"
            textColor="#d32f2f"
            onPress={handleDelete}
            style={styles.actionButton}
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
  paidChip: {
    backgroundColor: '#e8f5e9',
  },
  unpaidChip: {
    backgroundColor: '#ffebee',
  },
  paidText: {
    color: '#2e7d32',
  },
  unpaidText: {
    color: '#c62828',
  },
  actions: {
    flexDirection: 'column',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    width: '100%',
    marginBottom: 8,
  },
});
