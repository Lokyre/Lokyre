import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';

export const getDebtIcon = (type) => {
  switch (type) {
    case 'Tarjetas':
      return 'credit-card';
    case 'Créditos':
      return 'bank';
    case 'Personas':
      return 'account';
    default:
      return 'cash'; // Individuales or default
  }
};

const DebtCard = ({ debt, onPress }) => {
  const theme = useTheme();

  const isOverdue = new Date(debt.dueDate) < new Date() && debt.status !== 'Pagado';

  return (
    <Card
      style={[styles.card, debt.status === 'Pagado' ? styles.cardPaid : {}]}
      onPress={onPress}
      testID="debt-card"
    >
      <Card.Title
        title={debt.title}
        subtitle={debt.type}
        left={(props) => <IconButton {...props} icon={getDebtIcon(debt.type)} />}
        right={(props) => (
          <View style={styles.rightContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.amount,
                { color: debt.status === 'Pagado' ? theme.colors.outline : theme.colors.error }
              ]}
            >
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.footer}>
          <Text variant="bodySmall" style={{ color: isOverdue ? theme.colors.error : theme.colors.onSurfaceVariant }}>
            Vence: {new Date(debt.dueDate).toLocaleDateString()}
            {isOverdue ? ' (Vencido)' : ''}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.status, { color: debt.status === 'Pagado' ? theme.colors.primary : theme.colors.error }]}
          >
            {debt.status}
          </Text>
        </View>
      </Card.Content>
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
  rightContainer: {
    justifyContent: 'center',
    paddingRight: 16,
  },
  amount: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  status: {
    fontWeight: 'bold',
  },
});

export default DebtCard;
