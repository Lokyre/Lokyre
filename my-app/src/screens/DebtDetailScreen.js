import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  const handleToggleStatus = () => {
    toggleDebtStatus(debt.id);
    navigation.goBack();
  };

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

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title testID="detail-title">{debt.title}</Title>

          <View style={styles.row}>
            <Text variant="titleMedium" style={styles.label}>Monto:</Text>
            <Text variant="bodyLarge" testID="detail-amount">${debt.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium" style={styles.label}>Tipo:</Text>
            <Text variant="bodyLarge">{debt.type}</Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.row}>
              <Text variant="titleMedium" style={styles.label}>Vence el:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text variant="titleMedium" style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}

          <View style={styles.row}>
            <Text variant="titleMedium" style={styles.label}>Estado:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : 'red' }}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleToggleStatus}
          style={[styles.button, debt.isPaid ? styles.btnPending : styles.btnPaid]}
          testID="btn-toggle-status"
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="red"
          style={styles.button}
          testID="btn-delete"
        >
          Eliminar Deuda
        </Button>
      </View>
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
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 100,
  },
  descriptionContainer: {
    marginVertical: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 4,
  },
  btnPaid: {
    backgroundColor: '#4CAF50',
  },
  btnPending: {
    backgroundColor: '#FF9800',
  }
});

export default DebtDetailScreen;
