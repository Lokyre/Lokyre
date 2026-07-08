import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoading } = useDebts();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title testID={`debt-title-${item.id}`}>{item.title}</Title>
        <Paragraph>Tipo: {item.type}</Paragraph>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>Estado: {item.isPaid ? 'Pagada' : 'Pendiente'}</Paragraph>
      </Card.Content>
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
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
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
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
