import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const totalDebt = debts
    .filter(d => !d.isPaid)
    .reduce((sum, current) => sum + parseFloat(current.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type} - Vence: ${item.dueDate}`}
      />
      <Card.Content>
        <Text style={{ fontWeight: 'bold' }}>Monto: ${parseFloat(item.amount).toFixed(2)}</Text>
        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Total Pendiente</Text>
        <Text variant="headlineMedium" style={{ color: 'red' }}>${totalDebt.toFixed(2)}</Text>
      </View>
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />
      <FAB
        testID="fab"
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', alignItems: 'center', elevation: 2, marginBottom: 10 },
  list: { padding: 10, paddingBottom: 80 },
  card: { marginBottom: 10 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' }
});

export default HomeScreen;
