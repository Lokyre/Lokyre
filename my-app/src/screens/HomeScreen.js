import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Text, IconButton, ActivityIndicator, Chip, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, deleteDebt, toggleDebtPaid } = useContext(DebtContext);
  const theme = useTheme();

  const confirmDelete = (id) => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteDebt(id), style: 'destructive' }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`Tipo: ${item.type} | Vence: ${item.dueDate}`}
        right={(props) => (
          <View style={styles.cardActions}>
            <IconButton
              {...props}
              icon={item.isPaid ? 'check-circle' : 'circle-outline'}
              iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
              onPress={() => toggleDebtPaid(item.id)}
              testID={`toggle-${item.id}`}
            />
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => confirmDelete(item.id)}
              testID={`delete-${item.id}`}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="titleMedium">Monto: ${item.amount}</Text>
        {item.description ? (
          <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
        ) : null}
        <View style={styles.chipContainer}>
          <Chip
            icon={item.isPaid ? 'check' : 'alert'}
            style={{ backgroundColor: item.isPaid ? theme.colors.primaryContainer : theme.colors.errorContainer }}
          >
            {item.isPaid ? 'Pagada' : 'Pendiente'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyLarge">No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  chipContainer: {
    marginTop: 12,
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
