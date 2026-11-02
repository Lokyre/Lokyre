import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Title, Paragraph, Button, Card } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;
  const { deleteDebt } = useDebts();

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        deleteDebt(debt.id);
        navigation.goBack();
      }
    } else {
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
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Paragraph style={styles.detail}>Monto: ${debt.amount}</Paragraph>
          <Paragraph style={styles.detail}>Categoría: {debt.category}</Paragraph>
          {debt.description ? (
            <Paragraph style={styles.description}>
              Descripción: {debt.description}
            </Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            onPress={() => navigation.navigate('AddEditDebt', { debt })}
            testID="edit-debt-button"
          >
            Editar
          </Button>
          <Button
            onPress={handleDelete}
            color="red"
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
  card: {
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
  actions: {
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});
