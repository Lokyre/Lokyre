import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, FAB, Card, Text, IconButton, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const confirmDelete = (id) => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteDebt(id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debt: item })}>
      <Card.Title
        title={item.title}
        subtitle={`Categoría: ${item.category} - ${new Date(item.date).toLocaleDateString()}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => confirmDelete(item.id)}
            testID="delete-button"
          />
        )}
      />
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          ${item.amount.toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Gestor de Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text variant="titleLarge">Total Pendiente:</Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No tienes deudas pendientes.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
});

export default HomeScreen;
