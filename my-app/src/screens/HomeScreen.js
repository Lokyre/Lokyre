import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, deleteDebt, togglePaid } = useDebts();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const confirmDelete = (id) => {
    Alert.alert('Eliminar deuda', '¿Estás seguro de eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate}`}
      />
      <Card.Content>
        <Text variant="bodyMedium">Monto: ${item.amount}</Text>
        {item.description ? (
          <Text variant="bodySmall">Notas: {item.description}</Text>
        ) : null}
        <Text
          variant="labelLarge"
          style={{ color: item.isPaid ? 'green' : 'red', marginTop: 8 }}
        >
          Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => togglePaid(item.id)}>
          {item.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
        </Button>
        <Button onPress={() => confirmDelete(item.id)} textColor="red">
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
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
        testID="fab"
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16, paddingBottom: 80 },
  card: { marginBottom: 12 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default HomeScreen;
