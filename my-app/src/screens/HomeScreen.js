import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Button, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, deleteDebt, markAsPaid } = useContext(DebtContext);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} subtitle={`Tipo: ${item.type}`} />
      <Card.Content>
        <Text variant="titleLarge">${item.amount}</Text>
        <Text variant="bodyMedium">Vence: {item.dueDate}</Text>
        {item.description ? <Text variant="bodySmall">{item.description}</Text> : null}
        <Text variant="bodySmall" style={{ color: item.isPaid ? 'green' : 'red', marginTop: 8 }}>
          Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
      <Card.Actions>
        {!item.isPaid && (
          <Button onPress={() => markAsPaid(item.id)}>Marcar Pagado</Button>
        )}
        <Button onPress={() => deleteDebt(item.id)} textColor="red">Eliminar</Button>
      </Card.Actions>
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
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <FAB
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
      />
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
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
