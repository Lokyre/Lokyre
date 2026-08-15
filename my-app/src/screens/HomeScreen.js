import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Title, Paragraph, IconButton, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, togglePaid, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts
    .filter(debt => !debt.isPaid)
    .reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const confirmDelete = (id) => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteDebt(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={[styles.card, item.isPaid && styles.paidCard]}>
      <Card.Title
        title={item.description}
        subtitle={`Monto: $${item.amount} - Tipo: ${item.type}`}
        left={(props) => <IconButton {...props} icon="cash" />}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? "check-circle" : "circle-outline"}
              iconColor={item.isPaid ? "green" : "gray"}
              onPress={() => togglePaid(item.id)}
              testID={`toggle-paid-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor="red"
              onPress={() => confirmDelete(item.id)}
              testID={`delete-debt-${item.id}`}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total de Deudas Pendientes</Title>
          <Paragraph style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      {debts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge">No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#6200ee',
  },
  summaryTitle: {
    color: '#fff',
    textAlign: 'center',
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  cardActions: {
    flexDirection: 'row',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
