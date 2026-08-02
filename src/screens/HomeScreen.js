import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, FAB, ActivityIndicator, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, removeDebt } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const confirmDelete = (id) => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => removeDebt(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} testID={`debt-card-${item.id}`}>
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type}`}
        left={(props) => <IconButton {...props} icon="credit-card" />}
        right={(props) => <IconButton {...props} icon="delete" onPress={() => confirmDelete(item.id)} testID={`delete-${item.id}`} />}
      />
      <Card.Content>
        <Title>${parseFloat(item.amount).toFixed(2)}</Title>
        {item.description ? <Paragraph>{item.description}</Paragraph> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" subtitle="Gestión de deudas pendientes" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <View style={styles.content}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title style={styles.summaryTitle}>Total Deuda</Title>
              <Paragraph style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>

          <FlatList
            data={debts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Paragraph>No tienes deudas pendientes.</Paragraph>
              </View>
            )}
          />
        </View>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 15,
    backgroundColor: '#e3f2fd',
  },
  summaryTitle: {
    textAlign: 'center',
    color: '#1565c0',
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  card: {
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
