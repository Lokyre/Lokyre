import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';

const DebtCard = ({ debt, onDelete, onToggleStatus }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, debt.isPaid && styles.paidCard]}>
      <Card.Title
        title={debt.title}
        subtitle={`${debt.type} - Vence: ${debt.dueDate}`}
        titleStyle={[styles.title, debt.isPaid && styles.paidText]}
      />
      <Card.Content>
        <Text style={styles.amount}>
          Monto: ${parseFloat(debt.amount).toFixed(2)}
        </Text>
        {debt.description ? (
          <Text style={styles.description}>{debt.description}</Text>
        ) : null}
        <Text style={[styles.status, debt.isPaid ? styles.paidStatus : styles.unpaidStatus]}>
          Estado: {debt.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={debt.isPaid ? 'close-circle-outline' : 'check-circle-outline'}
          iconColor={debt.isPaid ? theme.colors.error : theme.colors.primary}
          size={24}
          onPress={onToggleStatus}
        />
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          size={24}
          onPress={onDelete}
        />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  paidCard: {
    opacity: 0.7,
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  paidStatus: {
    color: '#388e3c',
  },
  unpaidStatus: {
    color: '#d32f2f',
  },
});

export default DebtCard;
