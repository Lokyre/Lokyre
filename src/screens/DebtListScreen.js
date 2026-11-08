import React from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtListScreen = ({ route, navigation }) => {
  const { debts, deleteDebt, updateDebt } = useDebts();
  const filterCategory = route.params?.category || null;

  const displayDebts = filterCategory
    ? debts.filter(debt => debt.category === filterCategory)
    : debts;

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
        deleteDebt(id);
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
        ]
      );
    }
  };

  const handleToggleStatus = (debt) => {
    const newStatus = debt.status === 'Pendiente' ? 'Pagada' : 'Pendiente';
    updateDebt(debt.id, { status: newStatus });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.title}</Title>
          <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
        </View>
        <Paragraph>Categoría: {item.category}</Paragraph>
        <Paragraph>Estado: <Text style={item.status === 'Pagada' ? styles.statusPaid : styles.statusPending}>{item.status}</Text></Paragraph>
        {item.notes ? <Paragraph>Notas: {item.notes}</Paragraph> : null}
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button onPress={() => handleToggleStatus(item)}>
          {item.status === 'Pendiente' ? 'Marcar Pagada' : 'Marcar Pendiente'}
        </Button>
        <View style={styles.actionIcons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AddEditDebt', { id: item.id })}
          />
          <IconButton
            icon="delete"
            iconColor="red"
            size={20}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {displayDebts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={displayDebts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusPaid: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusPending: {
    color: 'orange',
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  actionIcons: {
    flexDirection: 'row',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default DebtListScreen;
