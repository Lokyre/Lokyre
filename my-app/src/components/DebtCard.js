import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function DebtCard({ debt, onPress }) {
  const theme = useTheme();
  const { togglePaid } = useDebts();

  const handleTogglePaid = (e) => {
    // Prevent the card onPress from triggering
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    togglePaid(debt.id);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Tarjeta': return 'credit-card';
      case 'Crédito': return 'bank';
      case 'Persona': return 'account';
      case 'Individual': return 'cash';
      default: return 'cash';
    }
  };

  return (
    <Card
      style={[styles.card, debt.isPaid && styles.paidCard]}
      onPress={onPress}
      testID={`debt-card-${debt.id}`}
    >
      <Card.Title
        title={debt.title}
        titleStyle={[debt.isPaid && styles.paidText]}
        subtitle={`$${debt.amount.toFixed(2)} - ${debt.type}`}
        left={(props) => <IconButton {...props} icon={getIconForType(debt.type)} />}
        right={(props) => (
          <IconButton
            {...props}
            icon={debt.isPaid ? 'check-circle' : 'circle-outline'}
            iconColor={debt.isPaid ? theme.colors.primary : 'gray'}
            onPress={handleTogglePaid}
            testID={`toggle-paid-icon-${debt.id}`}
          />
        )}
      />
      <Card.Content>
        <Paragraph style={debt.isPaid && styles.paidText}>
          Vence: {debt.dueDate}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  paidCard: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
