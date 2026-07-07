import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, FAB, Button, ActivityIndicator, Text, IconButton, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt, toggleDebtStatus, loading } = useDebts();
  const [filter, setFilter] = useState('All'); // 'All', 'Paid', 'Unpaid'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" testID="loading-indicator" />
      </View>
    );
  }

  const filteredDebts = debts.filter(debt => {
    if (filter === 'Paid') return debt.isPaid;
    if (filter === 'Unpaid') return !debt.isPaid;
    return true;
  });

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

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
    <Card style={styles.card} testID={`debt-card-${item.id}`}>
      <Card.Content>
        <Title testID={`debt-title-${item.id}`}>{item.title}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Vencimiento: {item.dueDate}</Paragraph>
        {item.description ? <Paragraph>Nota: {item.description}</Paragraph> : null}
        <Paragraph style={{ color: item.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
          Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => toggleDebtStatus(item.id)} testID={`toggle-status-${item.id}`}>
          {item.isPaid ? 'Marcar Pendiente' : 'Marcar Pagada'}
        </Button>
        <IconButton icon="delete" iconColor="red" size={20} onPress={() => confirmDelete(item.id)} testID={`delete-${item.id}`} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.filterContainer}>
        <Chip selected={filter === 'All'} onPress={() => setFilter('All')} style={styles.chip} testID="filter-all">Todas</Chip>
        <Chip selected={filter === 'Unpaid'} onPress={() => setFilter('Unpaid')} style={styles.chip} testID="filter-unpaid">Pendientes</Chip>
        <Chip selected={filter === 'Paid'} onPress={() => setFilter('Paid')} style={styles.chip} testID="filter-paid">Pagadas</Chip>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryContainer: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  summaryText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', padding: 10, gap: 10 },
  chip: { marginHorizontal: 5 },
  list: { padding: 10, paddingBottom: 80 },
  card: { marginBottom: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
