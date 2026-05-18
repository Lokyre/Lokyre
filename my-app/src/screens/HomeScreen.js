import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, IconButton, Button, Menu, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);
  const [filter, setFilter] = useState('All');
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const filteredDebts = debts.filter(debt => filter === 'All' || debt.type === filter);

  const totalDebt = filteredDebts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${parseFloat(item.amount).toFixed(2)}`}
        right={(props) => (
          <View style={{ flexDirection: 'row' }}>
             <IconButton
              {...props}
              icon={item.isPaid ? "check-circle" : "circle-outline"}
              iconColor={item.isPaid ? "green" : "gray"}
              onPress={() => markAsPaid(item.id)}
            />
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('DebtForm', { debt: item })}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor="red"
              onPress={() => deleteDebt(item.id)}
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
          <Text variant="titleMedium">Deuda Total Pendiente</Text>
          <Text variant="headlineMedium" style={{ color: 'red' }}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.filterContainer}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu} mode="outlined">Filtro: {filter === 'All' ? 'Todas' : filter}</Button>}>
          <Menu.Item onPress={() => { setFilter('All'); closeMenu(); }} title="Todas" />
          <Divider />
          <Menu.Item onPress={() => { setFilter('Tarjeta'); closeMenu(); }} title="Tarjetas" />
          <Menu.Item onPress={() => { setFilter('Crédito'); closeMenu(); }} title="Créditos" />
          <Menu.Item onPress={() => { setFilter('Persona'); closeMenu(); }} title="Personas" />
          <Menu.Item onPress={() => { setFilter('Individual'); closeMenu(); }} title="Individuales" />
        </Menu>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('DebtForm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'flex-start'
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  }
});

export default HomeScreen;
