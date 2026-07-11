import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, FAB, Button, ActivityIndicator, Checkbox } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, deleteDebt, toggleDebtStatus } = useDebts();

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount} - Tipo: ${item.type}`}
        titleStyle={[item.isPaid && styles.paidText]}
        subtitleStyle={[item.isPaid && styles.paidText]}
      />
      <Card.Content>
        <Text style={item.isPaid && styles.paidText}>Vence: {item.dueDate}</Text>
        {item.description ? (
           <Text style={item.isPaid && styles.paidText}>{item.description}</Text>
        ) : null}
      </Card.Content>
      <Card.Actions>
        <View style={styles.actionContainer}>
           <Checkbox
              status={item.isPaid ? 'checked' : 'unchecked'}
              onPress={() => toggleDebtStatus(item.id)}
            />
            <Text>Pagado</Text>
        </View>
        <Button onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}>
          Editar
        </Button>
        <Button buttonColor="red" textColor="white" onPress={() => handleDelete(item.id)}>
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
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
        style={styles.fab}
        icon="plus"
        testID="fab"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
};

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
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
