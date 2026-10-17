import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getIconForType = (type) => {
  switch (type) {
    case 'Tarjetas':
      return 'credit-card-outline';
    case 'Créditos':
      return 'bank-outline';
    case 'Personas':
      return 'account-outline';
    case 'Individuales':
      return 'file-document-outline';
    default:
      return 'cash';
  }
};

const DebtItem = ({ debt, onPress, onDelete }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={getIconForType(debt.type)} size={32} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleMedium">{debt.title}</Text>
          <Text variant="bodyMedium" style={styles.typeText}>{debt.type}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text variant="titleLarge" style={styles.amountText}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Text>
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => onDelete(debt.id)}
            testID={`delete-button-${debt.id}`}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  typeText: {
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  amountText: {
    marginRight: 8,
    fontWeight: 'bold',
  },
});

export default DebtItem;
