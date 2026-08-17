import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtItem({ debt, navigation }) {
  const { deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const theme = useTheme();

  const handleEdit = () => {
    navigation.navigate('DebtForm', { debt });
  };

  const statusColor = debt.isPaid ? theme.colors.primary : theme.colors.error;

  return (
    <Card style={styles.card} testID={`debt-item-${debt.id}`}>
      <Card.Title
        title={debt.name}
        subtitle={`Monto: $${debt.amount}`}
        right={(props) => (
          <View style={styles.actionsContainer}>
            <IconButton
              {...props}
              icon="pencil"
              onPress={handleEdit}
              testID={`edit-debt-${debt.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(debt.id)}
              testID={`delete-debt-${debt.id}`}
            />
          </View>
        )}
      />
      <Card.Content style={styles.content}>
        <Chip style={styles.typeChip}>{debt.type}</Chip>
        <Chip
          mode="outlined"
          onPress={() => toggleDebtStatus(debt.id)}
          style={{ borderColor: statusColor }}
          textStyle={{ color: statusColor }}
          testID={`toggle-status-${debt.id}`}
        >
          {debt.isPaid ? 'Pagado' : 'Pendiente'}
        </Chip>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  typeChip: {
    marginRight: 8,
  },
});
