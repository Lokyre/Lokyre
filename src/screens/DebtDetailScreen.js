import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();

  const debtId = route.params?.debtId;
  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.container}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            deleteDebt(debtId);
            navigation.goBack();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{debt.title}</Title>
          <Paragraph style={styles.amount}>Monto: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
          <Paragraph>Categoría: {debt.category}</Paragraph>
          <Paragraph>Fecha de registro: {new Date(debt.date).toLocaleDateString()}</Paragraph>
          {debt.description ? (
            <Paragraph style={styles.description}>Descripción: {debt.description}</Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
            testID="btn-edit"
          >
            Editar
          </Button>
          <Button
            color="red"
            onPress={handleDelete}
            testID="btn-delete"
          >
            Eliminar / Pagada
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
    marginTop: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    marginTop: 16,
    fontStyle: 'italic',
  },
  actions: {
    justifyContent: 'flex-end',
  }
});

export default DebtDetailScreen;
