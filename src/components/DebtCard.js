import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function DebtCard({ debt }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DebtDetail', { debtId: debt.id });
  };

  const totalPayments = (debt.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const balance = (parseFloat(debt.amount) || 0) - totalPayments;
  const isPaid = balance <= 0;

  return (
    <Card
      style={styles.card}
      onPress={handlePress}
      testID={`debt-card-${debt.id}`}
    >
      <Card.Title
        title={debt.title}
        subtitle={debt.type}
        right={(props) => (
          <IconButton
            {...props}
            icon={isPaid ? "check-circle" : "chevron-right"}
            iconColor={isPaid ? "green" : "gray"}
          />
        )}
      />
      <Card.Content>
        <Paragraph>Monto Total: ${parseFloat(debt.amount).toFixed(2)}</Paragraph>
        <Paragraph>Saldo Pendiente: ${Math.max(0, balance).toFixed(2)}</Paragraph>
        {debt.dueDate ? <Paragraph>Vencimiento: {debt.dueDate}</Paragraph> : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
});
