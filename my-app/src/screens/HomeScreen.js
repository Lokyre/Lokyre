import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, List, Text, Card, IconButton, useTheme, Appbar, Chip, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, toggleDebtStatus, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tarjeta':
        return 'credit-card';
      case 'Crédito':
        return 'bank';
      case 'Persona':
        return 'account';
      case 'Individual':
        return 'cash';
      default:
        return 'cash';
    }
  };

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
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <View style={styles.debtInfo}>
          <Text variant="titleMedium" style={{ textDecorationLine: item.isPaid ? 'line-through' : 'none' }}>
            {item.name}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
          <View style={styles.chips}>
            <Chip icon={getCategoryIcon(item.category)} compact style={styles.chip}>
              {item.category}
            </Chip>
            {item.dueDate ? (
              <Chip icon="calendar" compact style={styles.chip}>
                {item.dueDate}
              </Chip>
            ) : null}
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={item.isPaid ? "check-circle" : "circle-outline"}
            iconColor={item.isPaid ? theme.colors.primary : theme.colors.secondary}
            size={24}
            onPress={() => toggleDebtStatus(item.id)}
          />
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
          />
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={24}
            onPress={() => confirmDelete(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge">Total Pendiente</Text>
          <Text variant="displaySmall" style={{ color: theme.colors.error }}>
            ${totalPending.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes deudas registradas.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtInfo: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;
