import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DebtDetailScreen() {
  const { debts, deleteDebt, toggleIsPaid } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route.params;
  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>La deuda no existe.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Eliminar Deuda', '¿Estás seguro de que deseas eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteDebt(debt.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Text style={{ ...styles.amount, color: debt.isPaid ? 'green' : theme.colors.error }}>
            ${debt.amount.toFixed(2)}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={{ fontWeight: 'bold', color: debt.isPaid ? 'green' : 'red' }}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text>{debt.type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text>{debt.dueDate}</Text>
          </View>
          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => toggleIsPaid(debt.id)}
            style={styles.actionButton}
            testID="btn-toggle-paid"
          >
            {debt.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('DebtForm', { debt })}
            style={styles.actionButton}
            testID="btn-edit"
          >
            Editar
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={handleDelete}
            style={styles.actionButton}
            testID="btn-delete"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

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
    padding: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 100,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});
