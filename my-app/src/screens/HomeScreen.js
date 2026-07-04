import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, IconButton, FAB, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, loading, deleteDebt, togglePaidStatus } = useDebts();

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
    <Card style={[styles.card, item.isPaid && styles.paidCard]}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate}`}
        right={(props) => (
          <View style={styles.actionButtons}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? 'green' : 'gray'}
              onPress={() => togglePaidStatus(item.id)}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor="red"
              onPress={() => confirmDelete(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="titleLarge">${item.amount}</Text>
        {item.description ? <Text variant="bodyMedium">{item.description}</Text> : null}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyLarge">No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  paidCard: {
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
