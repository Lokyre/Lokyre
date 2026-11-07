import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { List, FAB, Divider, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);
  const theme = useTheme();

  if (loading) {
    return <View style={styles.container}><Text>Cargando...</Text></View>;
  }

  const renderDebtItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${item.type} - $${item.amount}`}
      left={props => <List.Icon {...props} icon={getIconForType(item.type)} />}
      right={props => <List.Icon {...props} icon={item.isPaid ? 'check-circle' : 'circle-outline'} color={item.isPaid ? 'green' : 'gray'}/>}
      onPress={() => navigation.navigate('DebtDetail', { debt: item })}
      titleStyle={item.isPaid ? styles.paidText : styles.unpaidText}
    />
  );

  const getIconForType = (type) => {
    switch(type) {
      case 'Tarjetas': return 'credit-card';
      case 'Créditos': return 'bank';
      case 'Personas': return 'account';
      case 'Individuales': return 'account-cash';
      default: return 'cash';
    }
  }

  const totalDebt = debts.filter(d => !d.isPaid).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalText}>Deuda Total Pendiente:</Text>
        <Text style={styles.totalAmount}>${totalDebt.toFixed(2)}</Text>
      </View>
      <Divider />
      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderDebtItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
        ItemSeparatorComponent={() => <Divider />}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  totalText: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  unpaidText: {
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
    fontSize: 16
  }
});

export default HomeScreen;
