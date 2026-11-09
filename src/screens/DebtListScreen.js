import React from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { List, IconButton, Divider, Text, Card } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { debts, deleteDebt } = useDebts();

  const filteredDebts = debts.filter(debt => debt.category === category);

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de eliminar esta deuda?')) {
        deleteDebt(id);
      }
    } else {
      Alert.alert(
        "Eliminar Deuda",
        "¿Estás seguro de eliminar esta deuda?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", onPress: () => deleteDebt(id), style: "destructive" }
        ]
      );
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <List.Item
        title={item.name}
        description={`Monto: $${parseFloat(item.amount).toFixed(2)}\nFecha: ${item.date}`}
        descriptionNumberOfLines={2}
        left={props => <List.Icon {...props} icon="currency-usd" />}
        right={props => (
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              onPress={() => navigation.navigate('AddDebt', { debt: item })}
            />
            <IconButton
              icon="delete"
              iconColor="red"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DebtListScreen;
