import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, FAB, Card, Text, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading, deleteDebt, toggleDebtStatus } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const totalUnpaid = debts
    .filter(d => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const confirmDelete = (id) => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteDebt(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      testID={`debt-card-${item.id}`}
      onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - Vence: ${item.dueDate}`}
        left={(props) => <IconButton {...props} icon={item.isPaid ? 'check-circle' : 'circle-outline'} iconColor={item.isPaid ? 'green' : 'gray'} onPress={() => toggleDebtStatus(item.id)} testID={`toggle-status-${item.id}`} />}
        right={(props) => <IconButton {...props} icon="delete" onPress={() => confirmDelete(item.id)} testID={`delete-debt-${item.id}`} />}
      />
      <Card.Content>
        <Text variant="titleMedium">${parseFloat(item.amount).toFixed(2)}</Text>
        {item.description ? <Text variant="bodyMedium">{item.description}</Text> : null}
        <Text style={{ color: item.isPaid ? 'green' : 'red', marginTop: 5 }}>
          {item.isPaid ? 'Pagada' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={[styles.summaryContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>Total Pendiente</Text>
        <Text variant="headlineLarge" style={{ color: theme.colors.onPrimaryContainer }}>${totalUnpaid.toFixed(2)}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : debts.length === 0 ? (
        <View style={styles.center}>
          <Text variant="bodyLarge">No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab"
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
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});