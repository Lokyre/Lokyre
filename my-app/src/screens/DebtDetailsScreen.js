import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const DebtDetailsScreen = ({ navigation, route }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, toggleDebtStatus } = useDebtContext();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Debt not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Debt',
      'Are you sure you want to delete this debt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>{debt.title}</Text>
          <Text variant="headlineMedium" style={styles.amount}>${debt.amount}</Text>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>Status:</Text>
            <Chip
              icon={debt.isPaid ? 'check' : 'close'}
              style={[styles.chip, { backgroundColor: debt.isPaid ? '#c8e6c9' : '#ffcdd2' }]}
            >
              {debt.isPaid ? 'Paid' : 'Pending'}
            </Chip>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>Type:</Text>
            <Text variant="bodyMedium">{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>Due Date:</Text>
            <Text variant="bodyMedium">{debt.dueDate || 'No date set'}</Text>
          </View>

          {!!debt.description && (
            <View style={styles.descriptionContainer}>
              <Text variant="bodyMedium" style={styles.label}>Description:</Text>
              <Text variant="bodyMedium">{debt.description}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="pencil"
          style={styles.button}
          onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
          testID="edit-button"
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          icon={debt.isPaid ? 'close' : 'check'}
          style={styles.button}
          onPress={() => toggleDebtStatus(debt.id)}
          testID="toggle-status-button"
        >
          Mark as {debt.isPaid ? 'Pending' : 'Paid'}
        </Button>
        <Button
          mode="text"
          textColor="red"
          icon="delete"
          style={styles.button}
          onPress={handleDelete}
          testID="delete-button"
        >
          Delete
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    color: '#2e7d32',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 80,
  },
  chip: {
    height: 28,
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

export default DebtDetailsScreen;
