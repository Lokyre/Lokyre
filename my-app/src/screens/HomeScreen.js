import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB, Card, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts } = useContext(DebtContext);
  const navigation = useNavigation();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.monto || 0), 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity testID={`debt-item-${item.id}`} onPress={() => navigation.navigate('DebtDetail', { id: item.id })}>
      <Card style={styles.card}>
        <Card.Title
          title={item.titulo}
          subtitle={`Monto: $${item.monto} - Categoría: ${item.categoria}`}
        />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text variant="titleLarge">Total de deudas: ${totalDebt.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        testID="fab-add-debt"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
