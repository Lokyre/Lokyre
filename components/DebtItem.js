import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';

export const DebtItem = ({ debt, onPress, onTogglePaid }) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (debt.type) {
      case 'tarjeta':
        return 'credit-card';
      case 'credito':
        return 'bank';
      case 'persona':
        return 'account';
      default:
        return 'cash';
    }
  };

  const getTypeName = () => {
    switch (debt.type) {
      case 'tarjeta':
        return 'Tarjeta';
      case 'credito':
        return 'Crédito';
      case 'persona':
        return 'Persona';
      default:
        return 'Individual';
    }
  };

  return (
    <Card style={[styles.card, debt.isPaid && styles.cardPaid]} onPress={onPress}>
      <Card.Title
        title={debt.title}
        subtitle={`${getTypeName()} - ${new Date(debt.date).toLocaleDateString()}`}
        left={(props) => <IconButton {...props} icon={getIcon()} />}
        right={(props) => (
          <Text
            {...props}
            variant="titleMedium"
            style={[styles.amount, { color: debt.isPaid ? theme.colors.primary : theme.colors.error }]}
          >
            ${Number(debt.amount).toFixed(2)}
          </Text>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardPaid: {
    opacity: 0.6,
  },
  amount: {
    fontWeight: 'bold',
    marginRight: 16,
    alignSelf: 'center',
  },
});
