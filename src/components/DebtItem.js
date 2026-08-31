import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';

const typeIcons = {
  'Tarjetas': 'credit-card',
  'Créditos': 'bank',
  'Personas': 'account',
  'Individuales': 'cash',
};

const DebtItem = ({ debt, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress} testID={`debt-item-${debt.id}`}>
      <Card.Title
        title={debt.title}
        subtitle={`${debt.type} - Vence: ${debt.dueDate || 'N/A'}`}
        left={(props) => <IconButton {...props} icon={typeIcons[debt.type] || 'currency-usd'} />}
        right={(props) => <Title style={styles.amount}>${debt.amount}</Title>}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  amount: {
    marginRight: 16,
    color: '#d32f2f', // Red to indicate debt
  }
});

export default DebtItem;
