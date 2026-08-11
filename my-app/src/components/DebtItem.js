import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';

export const DebtItem = ({ debt, onPress, onMarkAsPaid }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress} testID={`debt-item-${debt.id}`}>
      <Card.Title
        title={debt.title}
        subtitle={`${debt.type} - Vence: ${debt.dueDate}`}
        titleStyle={[styles.title, debt.isPaid && styles.paidText]}
        right={(props) => (
          <View style={styles.rightContainer}>
            <Text style={[styles.amount, debt.isPaid && styles.paidText]}>
              ${debt.amount}
            </Text>
            {!debt.isPaid && (
              <IconButton
                {...props}
                icon="check-circle-outline"
                testID={`mark-paid-${debt.id}`}
                onPress={() => onMarkAsPaid(debt.id)}
              />
            )}
            {debt.isPaid && (
              <IconButton
                {...props}
                icon="check-circle"
                iconColor={theme.colors.primary}
                disabled
              />
            )}
          </View>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  }
});
