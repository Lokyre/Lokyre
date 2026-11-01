import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';

const typeColors = {
  Tarjetas: '#ff9800',
  Créditos: '#2196f3',
  Personas: '#4caf50',
  Individuales: '#9c27b0',
};

const typeIcons = {
  Tarjetas: 'credit-card',
  Créditos: 'bank',
  Personas: 'account-group',
  Individuales: 'account',
};

const DebtItem = ({ debt, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.content}>
            <Text variant="titleMedium" style={debt.isPaid ? styles.paidText : null}>
              {debt.title}
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                icon={typeIcons[debt.type]}
                style={{ backgroundColor: typeColors[debt.type] + '20' }}
                textStyle={{ color: typeColors[debt.type] }}
                compact
              >
                {debt.type}
              </Chip>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text variant="titleLarge" style={[styles.amount, debt.isPaid ? styles.paidText : null]}>
              ${debt.amount.toFixed(2)}
            </Text>
            {debt.isPaid && (
              <IconButton icon="check-circle" iconColor="#4caf50" size={20} style={styles.icon} />
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingRight: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: 'bold',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#9e9e9e',
  },
  icon: {
    margin: 0,
    marginTop: -4,
  }
});

export default DebtItem;
