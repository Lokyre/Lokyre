import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Text, Title, useTheme, ActivityIndicator } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { debts, loading } = useContext(DebtContext);
  const navigation = useNavigation();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const totalPending = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} | Vence: ${item.dueDate}`}
        right={(props) => (
          <Text {...props} style={{ color: item.isPaid ? 'green' : 'red', paddingRight: 16, fontWeight: 'bold' }}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        )}
      />
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${item.amount}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.error }}>
            ${totalPending.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('DebtForm')}
        testID="fab-add-debt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  list: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
