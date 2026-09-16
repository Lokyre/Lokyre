import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.category}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon="pencil"
              testID={`edit-btn-${item.id}`}
              onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
            />
            <IconButton
              {...props}
              icon="delete"
              testID={`delete-btn-${item.id}`}
              onPress={() => deleteDebt(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Paragraph>Monto: ${item.amount.toFixed(2)}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente</Title>
        <Text style={[styles.total, { color: theme.colors.error }]}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        testID="add-fab"
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
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  cardActions: {
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
