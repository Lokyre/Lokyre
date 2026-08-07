import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params;
  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar o marcar como pagada esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>{debt.titulo}</Text>
          <Text variant="titleMedium" style={styles.detail}>Monto: ${debt.monto}</Text>
          <Text variant="titleMedium" style={styles.detail}>Categoría: {debt.categoria}</Text>
          <Text variant="titleMedium" style={styles.detail}>Fecha: {debt.fecha}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" buttonColor="#d32f2f" onPress={handleDelete} testID="btn-delete">
            Marcar como Pagada / Eliminar
          </Button>
        </Card.Actions>
      </Card>
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
    padding: 8,
  },
  title: {
    marginBottom: 16,
  },
  detail: {
    marginBottom: 8,
  },
});

export default DebtDetailScreen;
