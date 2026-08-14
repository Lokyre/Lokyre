import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt, loading } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const confirmDelete = (id) => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddEditDebt', { debt: item })}>
      <Card.Title
        title={item.title}
        titleTestID={`debt-title-${item.id}`}
        subtitle={`Tipo: ${item.type} | Fecha: ${item.date}`}
        subtitleTestID={`debt-subtitle-${item.id}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            testID={`delete-button-${item.id}`}
            onPress={() => confirmDelete(item.id)}
          />
        )}
      />
      <Card.Content>
        <Paragraph style={styles.amountText}>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Total Pendiente:</Title>
        <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text>No tienes deudas pendientes. ¡Genial!</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        testID="add-debt-fab"
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
