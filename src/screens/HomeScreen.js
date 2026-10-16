import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt, isLoaded } = useDebts();
  const theme = useTheme();
  const [filter, setFilter] = useState('All');

  const filteredDebts = useMemo(() => {
    if (filter === 'All') return debts;
    return debts.filter(debt => debt.type === filter);
  }, [debts, filter]);

  const totalDebt = useMemo(() => {
    return filteredDebts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);
  }, [filteredDebts]);

  const handleDelete = (id) => {
    // Basic fallback alert for web since Alert doesn't have same buttons API
    if (typeof window !== 'undefined' && window.alert && !window.confirm) {
        deleteDebt(id);
        return;
    }

    try {
        Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => deleteDebt(id) }
        ]
        );
    } catch(e) {
        // Web fallback
        if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
            deleteDebt(id);
        }
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Tarjetas': return 'credit-card';
      case 'Créditos': return 'bank';
      case 'Personas': return 'account-group';
      case 'Individuales': return 'account';
      default: return 'cash';
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AddDebt', { debtId: item.id })}>
      <Card.Title
        title={item.name}
        subtitle={`${item.type} ${item.dueDate ? `• Vence: ${item.dueDate}` : ''}`}
        left={(props) => <MaterialCommunityIcons {...props} name={getIconForType(item.type)} size={24} color={theme.colors.primary} />}
        right={(props) => (
          <View style={styles.rightActions}>
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
            <IconButton
              {...props}
              icon="delete"
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
    </Card>
  );

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total a Pagar ({filter === 'All' ? 'Todas' : filter})</Title>
          <Text style={styles.summaryAmount}>{formatCurrency(totalDebt)}</Text>
        </Card.Content>
      </Card>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'All', label: 'Todas' },
          { value: 'Tarjetas', label: 'Tarjetas' },
          { value: 'Créditos', label: 'Créditos' },
          { value: 'Personas', label: 'Personas' },
        ]}
        style={styles.segmentedButtons}
        density="small"
      />

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No hay deudas registradas.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
}

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
  summaryCard: {
    margin: 16,
    backgroundColor: '#e3f2fd',
  },
  summaryTitle: {
    textAlign: 'center',
    color: '#0277bd',
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#01579b',
    marginTop: 8,
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
