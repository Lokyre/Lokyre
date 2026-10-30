import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtItem({ debt }) {
  const { markAsPaid, deleteDebt } = useDebts();
  const theme = useTheme();

  return (
    <Card style={[styles.card, debt.isPaid && styles.paidCard]} testID={`debtItem-${debt.id}`}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={debt.isPaid ? styles.paidText : {}}>{debt.title}</Title>
          <Text style={[styles.amount, { color: debt.isPaid ? theme.colors.disabled : theme.colors.error }]}>
            ${Number(debt.amount).toFixed(2)}
          </Text>
        </View>
        <Paragraph>Tipo: {debt.type}</Paragraph>
        {debt.dueDate ? <Paragraph>Vence: {debt.dueDate}</Paragraph> : null}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          onPress={() => markAsPaid(debt.id)}
          color={debt.isPaid ? theme.colors.primary : theme.colors.accent}
          testID={`payButton-${debt.id}`}
        >
          {debt.isPaid ? 'Marcar como pendiente' : 'Marcar como pagada'}
        </Button>
        <IconButton
          icon="delete"
          color={theme.colors.error}
          size={20}
          onPress={() => deleteDebt(debt.id)}
          testID={`deleteButton-${debt.id}`}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
  },
  paidCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paidText: {
    textDecorationLine: 'line-through',
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
