import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, markAsPaid, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { debtId } = route.params;
  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Debt not found.</Text>
      </View>
    );
  }

  const handleMarkAsPaid = () => {
    Alert.alert('Confirm', 'Are you sure you want to mark this debt as paid?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          markAsPaid(debt.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this debt?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDebt(debt.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Amount:</Text>
            <Text variant="titleMedium">${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Type:</Text>
            <Text variant="bodyLarge">{debt.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Due Date:</Text>
            <Text variant="bodyLarge">{new Date(debt.dueDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Status:</Text>
            <Text variant="bodyLarge" style={{ color: debt.isPaid ? 'green' : theme.colors.error, fontWeight: 'bold' }}>
              {debt.isPaid ? 'Paid' : 'Active'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="titleMedium">Created:</Text>
            <Text variant="bodyLarge">{new Date(debt.createdAt).toLocaleDateString()}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.button}
            buttonColor="green"
          >
            Mark as Paid
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.button}
          buttonColor={theme.colors.error}
        >
          Delete Debt
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginBottom: 16,
    padding: 5,
  },
});

export default DebtDetailScreen;
