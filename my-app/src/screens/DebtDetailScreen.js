import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { togglePaidStatus, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const handleTogglePaid = () => {
    togglePaidStatus(debt.id);
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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={debt.title} subtitle={debt.type} />
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Monto:</Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
              ${debt.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="titleMedium">Estado:</Text>
            <Text
              variant="bodyLarge"
              style={{ color: debt.isPaid ? 'green' : theme.colors.error, fontWeight: 'bold' }}
            >
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.row}>
              <Text variant="titleMedium">Vencimiento:</Text>
              <Text variant="bodyLarge">{debt.dueDate}</Text>
            </View>
          ) : null}

          {debt.description ? (
            <View style={styles.column}>
              <Text variant="titleMedium">Descripción:</Text>
              <Text variant="bodyMedium" style={styles.description}>
                {debt.description}
              </Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleTogglePaid}
          style={styles.button}
          buttonColor={debt.isPaid ? theme.colors.primary : 'green'}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor={theme.colors.error}
          style={{ borderColor: theme.colors.error }}
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  column: {
    marginTop: 12,
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 4,
  },
});

export default DebtDetailScreen;
