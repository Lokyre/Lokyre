import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, FAB, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading, togglePaid, deleteDebt } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pendingDebts = debts.filter(d => !d.isPaid);
  const totalAmount = pendingDebts.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const confirmDelete = (id) => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteDebt(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${item.amount}`}
        testID={`debt-title-${item.id}`}
        titleStyle={{ textDecorationLine: item.isPaid ? 'line-through' : 'none' }}
        right={(props) => (
          <View style={{ flexDirection: 'row' }}>
             <IconButton
              {...props}
              icon={item.isPaid ? "check-circle" : "circle-outline"}
              iconColor={item.isPaid ? "green" : "gray"}
              onPress={() => togglePaid(item.id)}
              testID={`toggle-paid-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor="red"
              onPress={() => confirmDelete(item.id)}
              testID={`delete-debt-${item.id}`}
            />
          </View>
        )}
      />
      {item.description ? (
        <Card.Content>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Pendiente</Text>
          <Text variant="headlineLarge" style={styles.totalText}>${totalAmount.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#e0f7fa',
  },
  totalText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
