import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, List, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function HomeScreen({ navigation }) {
  const { debts, deleteDebt } = useContext(DebtContext);

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const debtsByCategory = debts.reduce((acc, debt) => {
    acc[debt.category] = (acc[debt.category] || 0) + parseFloat(debt.amount || 0);
    return acc;
  }, {});

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de eliminar esta deuda?')) {
        deleteDebt(id);
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
        ]
      );
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.description}</Title>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDelete(item.id)}
            testID={`delete-button-${item.id}`}
          />
        </View>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Categoría: {item.category}</Paragraph>
        <Paragraph>Fecha: {new Date(item.date).toLocaleDateString()}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Deuda Total: ${totalDebt.toFixed(2)}</Text>
        <View style={styles.categorySummary}>
          {['Tarjetas', 'Créditos', 'Personas', 'Individuales'].map(category => (
            debtsByCategory[category] ? (
              <Text key={category} style={styles.categoryText}>
                {category}: ${debtsByCategory[category].toFixed(2)}
              </Text>
            ) : null
          ))}
        </View>
      </View>

      <Divider style={styles.divider} />

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes deudas registradas.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
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
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categorySummary: {
    marginTop: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
