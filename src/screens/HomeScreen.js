import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, List, Text, IconButton, Chip } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const [filterType, setFilterType] = useState('Todas');

  const types = ['Todas', 'Tarjetas', 'Créditos', 'Personas', 'Individuales'];

  const filteredDebts = filterType === 'Todas'
    ? debts
    : debts.filter(debt => debt.type === filterType);

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + Number(debt.amount), 0);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`Monto: $${item.amount} - Tipo: ${item.type}`}
      right={props => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" onPress={() => navigation.navigate('AddEditDebt', { debt: item })} />
          <IconButton icon="delete" onPress={() => deleteDebt(item.id)} />
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.filters}>
        <FlatList
          horizontal
          data={types}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={filterType === item}
              onPress={() => setFilterType(item)}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filters: {
    padding: 10,
    backgroundColor: '#fff',
  },
  chip: {
    marginRight: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
