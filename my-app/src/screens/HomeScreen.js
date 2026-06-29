import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, FAB, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, loading, toggleDebtStatus, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteDebt(id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddDebt', { debtId: item.id })}>
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount} - Tipo: ${item.type}`}
        right={(props) => (
          <View style={styles.actions}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              onPress={() => toggleDebtStatus(item.id)}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor="red"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text>Vencimiento: {item.dueDate}</Text>
        <Text>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text variant="bodyLarge">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
