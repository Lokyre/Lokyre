import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, item.isPaid && styles.paidCard]}
      onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
    >
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium">Monto: ${item.amount}</Text>
        <Text variant="bodySmall">Tipo: {item.type}</Text>
        <Text variant="bodySmall">Vencimiento: {item.dueDate}</Text>
        <Text variant="bodySmall" style={{ color: item.isPaid ? 'green' : 'red' }}>
          Estado: {item.isPaid ? 'Pagado' : 'Pendiente'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.centered}>
          <Text>No tienes deudas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={[...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB
        icon="plus"
        testID="fab"
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
    marginBottom: 12,
  },
  paidCard: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
