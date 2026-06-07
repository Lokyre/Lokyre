import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, Card, Text, IconButton, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const [filter, setFilter] = useState('Todos');
  const theme = useTheme();

  const types = ['Todos', 'Tarjeta', 'Crédito', 'Persona', 'Individual'];

  const filteredDebts = filter === 'Todos' ? debts : debts.filter(debt => debt.type === filter);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount} - Vence: ${item.dueDate}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? "check-circle" : "circle-outline"}
              iconColor={item.isPaid ? "green" : "gray"}
              onPress={() => toggleDebtStatus(item.id)}
            />
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => navigation.navigate('AddDebt', { debtId: item.id })}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => deleteDebt(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium">Tipo: {item.type}</Text>
        {item.description ? <Text variant="bodySmall">{item.description}</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={types}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              style={styles.chip}
              selected={filter === item}
              onPress={() => setFilter(item)}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        testID="fab"
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterContainer: { paddingVertical: 10, paddingHorizontal: 5, backgroundColor: 'white' },
  chip: { marginHorizontal: 5 },
  list: { padding: 10, paddingBottom: 80 },
  card: { marginBottom: 10 },
  cardActions: { flexDirection: 'row' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default HomeScreen;
