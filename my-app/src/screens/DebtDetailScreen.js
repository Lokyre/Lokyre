import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Text, useTheme, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.center}>
        <Text>Debt not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Debt",
      "Are you sure you want to delete this debt?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleMarkAsPaid = () => {
    Alert.alert(
      "Mark as Paid",
      "Are you sure you want to mark this debt as paid?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            markAsPaid(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{debt.title}</Title>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={[styles.value, { color: debt.isPaid ? 'green' : theme.colors.error }]}>
          ${parseFloat(debt.amount).toFixed(2)}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{debt.type}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.label}>Date Added:</Text>
        <Text style={styles.value}>{new Date(debt.date).toLocaleString()}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: debt.isPaid ? 'green' : theme.colors.error }]}>
          {debt.isPaid ? 'Paid' : 'Pending'}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailBlock}>
        <Text style={styles.label}>Description:</Text>
        <Paragraph style={styles.description}>
          {debt.description || "No description provided."}
        </Paragraph>
      </View>

      <View style={styles.buttonContainer}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={[styles.button, { backgroundColor: 'green' }]}
          >
            Mark as Paid
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          textColor={theme.colors.error}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailBlock: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 6,
  },
});

export default DebtDetailScreen;
