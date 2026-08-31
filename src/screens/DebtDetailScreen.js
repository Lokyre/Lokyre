import React, { useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Title, Paragraph, Button, Card, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ navigation, route }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Title>Deuda no encontrada.</Title>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda? Esta acción no se puede deshacer.',
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
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Title style={styles.label}>Monto:</Title>
            <Title style={styles.amount}>${debt.amount}</Title>
          </View>

          <View style={styles.row}>
            <Paragraph style={styles.label}>Tipo:</Paragraph>
            <Paragraph>{debt.type}</Paragraph>
          </View>

          <View style={styles.row}>
            <Paragraph style={styles.label}>Vencimiento:</Paragraph>
            <Paragraph>{debt.dueDate || 'No especificada'}</Paragraph>
          </View>

          <View style={styles.row}>
            <Paragraph style={styles.label}>Descripción:</Paragraph>
            <Paragraph style={styles.descText}>{debt.description || 'Sin descripción'}</Paragraph>
          </View>

        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })}
            testID="btn-edit"
          >
            Editar
          </Button>
          <Button
            mode="contained"
            color="#d32f2f"
            icon="delete"
            onPress={handleDelete}
            testID="btn-delete"
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
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
    paddingVertical: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1976d2',
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  amount: {
    color: '#d32f2f',
    fontSize: 22,
  },
  descText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  actions: {
    justifyContent: 'space-around',
    paddingTop: 16,
  }
});

export default DebtDetailScreen;
