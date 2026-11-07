import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { deleteDebt, markAsPaid, debts } = useContext(DebtContext);

  // Get current debt from context to ensure we have the latest state (e.g. isPaid)
  const currentDebt = debts.find(d => d.id === debt.id) || debt;

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
        deleteDebt(currentDebt.id);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        "Eliminar Deuda",
        "¿Estás seguro de que quieres eliminar esta deuda?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: () => {
              deleteDebt(currentDebt.id);
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  const handleTogglePaid = () => {
    markAsPaid(currentDebt.id);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{currentDebt.title}</Title>
          <Text style={[styles.status, currentDebt.isPaid ? styles.paidText : styles.unpaidText]}>
            Estado: {currentDebt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
          <Divider style={styles.divider} />

          <Paragraph style={styles.label}>Monto:</Paragraph>
          <Paragraph style={styles.value}>${currentDebt.amount.toFixed(2)}</Paragraph>

          <Paragraph style={styles.label}>Tipo:</Paragraph>
          <Paragraph style={styles.value}>{currentDebt.type}</Paragraph>

          <Paragraph style={styles.label}>Descripción:</Paragraph>
          <Paragraph style={styles.value}>{currentDebt.description || 'Sin descripción'}</Paragraph>

          <Paragraph style={styles.label}>Fecha de creación:</Paragraph>
          <Paragraph style={styles.value}>{new Date(currentDebt.createdAt).toLocaleDateString()}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleTogglePaid}
            color={currentDebt.isPaid ? '#ff9800' : '#4caf50'}
            style={styles.actionButton}
            testID="toggle-paid-button"
          >
            {currentDebt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            color="#f44336"
            style={styles.actionButton}
            testID="delete-button"
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
  card: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
  },
  paidText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  unpaidText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    marginVertical: 8,
  }
});

export default DebtDetailScreen;
