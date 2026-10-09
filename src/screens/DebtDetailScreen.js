import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debts, toggleDebtStatus, deleteDebt } = useDebtContext();
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  useLayoutEffect(() => {
    if (debt) {
      navigation.setOptions({ title: debt.title });
    }
  }, [navigation, debt]);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleDelete = () => {
    const confirmDelete = () => {
      deleteDebt(debt.id);
      navigation.goBack();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: confirmDelete }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{debt.title}</Title>
            <Text style={styles.amount}>${debt.amount.toFixed(2)}</Text>
          </View>

          <View style={styles.tagsContainer}>
            <Chip icon="tag" style={styles.chip}>{debt.type}</Chip>
            <Chip
              icon={debt.isPaid ? "check-circle" : "clock-outline"}
              style={[styles.chip, debt.isPaid ? styles.paidBg : styles.pendingBg]}
              textStyle={debt.isPaid ? { color: 'white' } : {}}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Chip>
          </View>

          {debt.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          icon={debt.isPaid ? "close-circle" : "check-circle"}
          onPress={() => toggleDebtStatus(debt.id)}
          style={[styles.button, debt.isPaid ? styles.markPendingBtn : styles.markPaidBtn]}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          icon="delete"
          textColor="#d32f2f"
          onPress={handleDelete}
          style={styles.button}
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
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  paidBg: {
    backgroundColor: '#4caf50',
  },
  pendingBg: {
    backgroundColor: '#ff9800',
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  markPaidBtn: {
    backgroundColor: '#4caf50',
  },
  markPendingBtn: {
    backgroundColor: '#ff9800',
  }
});
