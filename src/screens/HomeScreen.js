import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, IconButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}>
      <Card.Title
        title={item.name}
        subtitle={item.category || 'Sin categoría'}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => deleteDebt(item.id)}
            testID={`delete-button-${item.id}`}
          />
        )}
      />
      <Card.Content>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        {item.dueDate ? <Paragraph>Vence: {item.dueDate}</Paragraph> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Total Pendiente: ${totalDebt.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-fab"
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
    justifyContent: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;
