import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { deleteDebt } = useContext(DebtContext);

  const handleMarkAsPaid = () => {
    Alert.alert(
      "Mark as Paid",
      "Are you sure you want to mark this debt as paid and delete it?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.name}</Title>
          <Paragraph style={styles.typeLabel}>{debt.type}</Paragraph>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{debt.dueDate || 'N/A'}</Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Description:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="contained" buttonColor="#4caf50" onPress={handleMarkAsPaid}>
            Mark as Paid
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  typeLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  descriptionContainer: {
    marginTop: 12,
  },
  actions: {
    justifyContent: 'flex-end',
    padding: 16,
  },
});

export default DebtDetailScreen;
