import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, IconButton, FAB } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const ListScreen = () => {
  const { debts, deleteDebt } = useDebts();
  const navigation = useNavigation();
  const route = useRoute();

  const category = route?.params?.category;

  const filteredDebts = category
    ? debts.filter(debt => debt.type === category)
    : debts;

  const handleDelete = (id) => {
    deleteDebt(id);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEdit', { debtId: item.id })} testID={`debt-item-${item.id}`}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
          <Paragraph style={styles.amount}>${Number(item.amount).toFixed(2)}</Paragraph>
          {!category && <Paragraph style={styles.typeLabel}>{item.type}</Paragraph>}
        </View>
        <IconButton
          icon="delete"
          iconColor="red"
          size={24}
          onPress={() => handleDelete(item.id)}
          testID={`delete-btn-${item.id}`}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Title style={styles.emptyText}>No hay deudas registradas.</Title>}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEdit', { category })}
        testID="fab-add-debt-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  amount: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 4,
  },
  typeLabel: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ListScreen;
