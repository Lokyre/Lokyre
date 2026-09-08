import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';

export default function DebtCard({ debt, onEdit, onDelete }) {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={() => onEdit(debt)} testID={`debt-card-${debt.id}`}>
      <Card.Title
        title={debt.title}
        subtitle={debt.type}
        left={(props) => (
          <IconButton
            {...props}
            icon={
              debt.type === 'Tarjeta' ? 'credit-card' :
              debt.type === 'Crédito' ? 'bank' : 'account'
            }
          />
        )}
        right={(props) => (
          <View style={styles.actions}>
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => onEdit(debt)}
              testID={`edit-btn-${debt.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => onDelete(debt.id)}
              testID={`delete-btn-${debt.id}`}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.amount}>
          Monto: ${parseFloat(debt.amount).toFixed(2)}
        </Text>
        {!!debt.description && (
          <Text variant="bodySmall" numberOfLines={2}>
            {debt.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  amount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
  },
});
