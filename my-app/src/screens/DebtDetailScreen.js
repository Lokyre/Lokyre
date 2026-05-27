import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;
  const { deleteDebt, togglePaidStatus } = useContext(DebtContext);

  const handleDelete = () => {
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
  };

  const handleToggleStatus = () => {
    togglePaidStatus(debt.id);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.name}</Title>
          <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, debt.isPaid ? styles.paidText : styles.unpaidText]}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.label}>Fecha de registro:</Text>
            <Text style={styles.value}>
              {new Date(debt.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          style={styles.button}
          buttonColor={debt.isPaid ? "#ff9800" : "#4caf50"}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor="#f44336"
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 24,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#b00020',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  paidText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  unpaidText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 6,
  },
});
