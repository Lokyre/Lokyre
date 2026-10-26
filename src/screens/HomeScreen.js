import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, FAB, List, IconButton, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getDebts, deleteDebt } from '../services/storage';

const CATEGORIES = ['Tarjetas', 'Créditos', 'Personas', 'Individuales'];

export default function HomeScreen({ navigation }) {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const loadDebts = async () => {
    setLoading(true);
    const storedDebts = await getDebts();
    setDebts(storedDebts);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadDebts();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(id);
            loadDebts();
          },
        },
      ]
    );
  };

  const totalAmount = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const getCategorySummary = () => {
    const summary = {};
    CATEGORIES.forEach((cat) => {
      summary[cat] = 0;
    });
    debts.forEach((debt) => {
      if (summary[debt.category] !== undefined) {
        summary[debt.category] += parseFloat(debt.amount || 0);
      }
    });
    return summary;
  };

  const summary = getCategorySummary();

  const renderDebtItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`${item.category} - ${item.description || 'Sin descripción'}`}
      right={(props) => (
        <View style={styles.listItemRight}>
          <Text style={styles.debtAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Deuda Total</Text>
          <Text variant="headlineMedium" style={styles.totalAmount}>
            ${totalAmount.toFixed(2)}
          </Text>

          <View style={styles.categorySummary}>
            {CATEGORIES.map((cat) => (
              <View key={cat} style={styles.categoryRow}>
                <Text>{cat}:</Text>
                <Text style={styles.categoryAmount}>${summary[cat].toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.listTitle}>Tus Deudas</Text>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderDebtItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        testID="add-debt-fab"
        onPress={() => navigation.navigate('AddEditDebt')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categorySummary: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryAmount: {
    fontWeight: 'bold',
  },
  listTitle: {
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debtAmount: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
