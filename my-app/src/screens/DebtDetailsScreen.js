import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  const handleToggleStatus = () => {
    toggleDebtStatus(debt.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
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
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Monto: </Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Tipo: </Text>
            <Text style={styles.value}>{debt.type}</Text>
          </Paragraph>
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Vencimiento: </Text>
            <Text style={styles.value}>{debt.dueDate}</Text>
          </Paragraph>
          {debt.description ? (
            <Paragraph style={styles.detail}>
              <Text style={styles.label}>Descripción: </Text>
              <Text style={styles.value}>{debt.description}</Text>
            </Paragraph>
          ) : null}
          <Paragraph style={styles.detail}>
            <Text style={styles.label}>Estado: </Text>
            <Text style={{ color: debt.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          style={styles.button}
          buttonColor={debt.isPaid ? '#f57c00' : '#388e3c'}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddEditDebt', { debt })}
          style={styles.button}
          buttonColor="#1976d2"
        >
          Editar Deuda
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#d32f2f"
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
  card: {
    marginBottom: 24,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detail: {
    marginBottom: 8,
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    color: '#333',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 12,
  },
});

export default DebtDetailsScreen;
