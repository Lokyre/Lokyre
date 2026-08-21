import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailsScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { debt: routeDebt } = route.params;
  const { debts, deleteDebt, markAsPaid } = useDebtContext();
  const debt = debts.find(d => d.id === routeDebt.id) || routeDebt;

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
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Text style={styles.typeBadge}>{debt.type}</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Monto:</Text>
            <Text style={[styles.amountValue, { color: debt.paid ? 'green' : '#d32f2f' }]}>
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <Text style={[styles.statusValue, { color: debt.paid ? 'green' : 'orange' }]}>
              {debt.paid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Descripción:</Text>
              <Paragraph style={styles.descriptionText}>{debt.description}</Paragraph>
            </View>
          ) : null}

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Registrada el:</Text>
            <Text style={styles.dateValue}>{new Date(debt.date).toLocaleDateString()}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode={debt.paid ? "outlined" : "contained"}
            onPress={handleMarkAsPaid}
            testID="btn-toggle-paid"
            style={styles.actionButton}
          >
            {debt.paid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddEditDebt', { debt })}
            testID="btn-edit-debt"
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode="text"
            textColor="red"
            onPress={handleDelete}
            testID="btn-delete-debt"
            style={styles.actionButton}
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
  card: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#616161',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 18,
    marginRight: 8,
    color: '#424242',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#424242',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#424242',
  },
  descriptionText: {
    fontSize: 14,
    color: '#616161',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  dateValue: {
    fontSize: 12,
    color: '#757575',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    marginVertical: 4,
  }
});

export default DebtDetailsScreen;
