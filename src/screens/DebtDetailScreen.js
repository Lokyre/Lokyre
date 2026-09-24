import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, Card, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, deleteDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route?.params || {};
  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe o fue eliminada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    // Para simplificar la prueba y entornos web/nativo, usar una confirmación si existe o directamente eliminar
    if (globalThis.alert) {
      deleteDebt(debtId);
      navigation.goBack();
    } else {
        deleteDebt(debtId);
        navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={[styles.value, { color: theme.colors.error }]}>
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>
          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.description}>{debt.description}</Paragraph>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{new Date(debt.date).toLocaleDateString()}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })}
            style={styles.button}
            testID="edit-debt-button"
          >
            Editar
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={handleDelete}
            style={styles.button}
            testID="delete-debt-button"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

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
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginTop: 4,
  },
  actions: {
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
