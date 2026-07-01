import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que quieres eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.title}</Title>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Vencimiento: {item.dueDate}</Paragraph>
        {item.description ? <Paragraph>{item.description}</Paragraph> : null}
        <Paragraph>Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => toggleDebtStatus(item.id)}>
          {item.isPaid ? 'Marcar Pendiente' : 'Marcar Pagado'}
        </Button>
        <Button onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}>
          Editar
        </Button>
        <Button buttonColor="red" textColor="white" onPress={() => handleDelete(item.id)}>
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text>No hay deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        testID="fab"
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontStyle: 'italic',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
