import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, IconButton, Text, Divider, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const getIconForType = (type) => {
  switch (type) {
    case 'Tarjetas': return 'credit-card';
    case 'Créditos': return 'bank';
    case 'Personas': return 'account';
    case 'Individuales': return 'cash';
    default: return 'help-circle';
  }
};

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt, markAsPaid } = useDebts();
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={`Monto: $${item.amount} - Tipo: ${item.type}`}
      left={props => <List.Icon {...props} icon={getIconForType(item.type)} />}
      right={props => (
        <View style={styles.actions}>
          {!item.isPaid ? (
            <IconButton
              icon="check"
              iconColor={theme.colors.primary}
              size={20}
              onPress={() => markAsPaid(item.id)}
            />
          ) : (
            <Text style={[styles.paidText, { color: theme.colors.primary }]}>Pagado</Text>
          )}
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={20}
            onPress={() => deleteDebt(item.id)}
          />
        </View>
      )}
      style={item.isPaid ? styles.paidItem : null}
      titleStyle={item.isPaid ? styles.paidTextDecoration : null}
    />
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
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add-debt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  paidItem: {
    opacity: 0.6,
  },
  paidTextDecoration: {
    textDecorationLine: 'line-through',
  }
});
