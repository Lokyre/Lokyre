import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('DebtDetail', { id: item.id })}>
        <Card style={styles.card}>
          <Card.Content>
            <Title testID={`debt-title-${item.id}`}>{item.title}</Title>
            <Paragraph>{item.type}</Paragraph>
            <Text style={{ ...styles.amount, color: item.isPaid ? 'green' : theme.colors.error }}>
              ${item.amount}
            </Text>
            <Text style={styles.status}>
              {item.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
            <Text style={styles.date}>
              Vence: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const activeDebts = debts.filter((d) => !d.isPaid);
  const totalAmount = activeDebts.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente: ${totalAmount.toFixed(2)}</Title>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        testID="fab"
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  status: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  date: {
    marginTop: 4,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;
