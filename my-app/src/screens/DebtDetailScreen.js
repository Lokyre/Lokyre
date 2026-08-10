import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, Card, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, updateDebt } = useContext(DebtContext);

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleTogglePaid = async () => {
    await updateDebt(id, { isPaid: !debt.isPaid });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}

          <Text style={styles.dateText}>
            Creado: {new Date(debt.createdAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={[styles.button, { backgroundColor: debt.isPaid ? '#ff9800' : '#4caf50' }]}
          testID="btn-toggle-paid"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddDebt', { id: debt.id })}
          style={styles.button}
          testID="btn-edit"
        >
          Editar Deuda
        </Button>

        <Button
          mode="text"
          textColor="red"
          onPress={handleDelete}
          style={styles.button}
          testID="btn-delete"
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 16,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
