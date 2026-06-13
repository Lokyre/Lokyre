import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, toggleDebtPaid } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteDebt(debtId);
    navigation.goBack();
  };

  const handleTogglePaid = () => {
    toggleDebtPaid(debtId);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>

          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${debt.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.row}>
              <Text style={styles.label}>Vencimiento:</Text>
              <Text style={styles.value}>{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.description}>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={styles.button}
          buttonColor={debt.isPaid ? '#ff9800' : '#4caf50'}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#f44336"
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

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
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    color: '#444',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
  },
});

export default DebtDetailScreen;
