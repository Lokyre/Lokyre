import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, IconButton, Divider, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtListScreen = () => {
  const { debts, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const theme = useTheme();

  const getCategoryLabel = (value) => {
    switch(value) {
      case 'card': return 'Tarjeta';
      case 'loan': return 'Crédito';
      case 'person': return 'Persona';
      case 'individual': return 'Individual';
      default: return value;
    }
  };

  const getCategoryIcon = (value) => {
    switch(value) {
      case 'card': return 'credit-card';
      case 'loan': return 'bank';
      case 'person': return 'account';
      case 'individual': return 'cash';
      default: return 'cash';
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${getCategoryLabel(item.category)} - $${item.amount.toFixed(2)}${item.description ? `\n${item.description}` : ''}`}
      left={props => <List.Icon {...props} icon={getCategoryIcon(item.category)} color={item.paid ? '#4caf50' : '#f44336'} />}
      right={props => (
        <View style={styles.actionContainer}>
          <IconButton
            icon={item.paid ? "check-circle" : "check-circle-outline"}
            iconColor={item.paid ? '#4caf50' : '#757575'}
            onPress={() => toggleDebtStatus(item.id)}
          />
          <IconButton
            icon="delete"
            iconColor="#f44336"
            onPress={() => deleteDebt(item.id)}
          />
        </View>
      )}
      titleStyle={item.paid ? styles.paidText : styles.unpaidText}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  unpaidText: {
    fontWeight: 'bold',
  },
  listItem: {
    paddingVertical: 8,
  }
});

export default DebtListScreen;
