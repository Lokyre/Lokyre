import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
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

  const totalDebt = debts
    .filter((d) => !d.isPaid)
    .reduce((sum, current) => sum + (parseFloat(current.amount) || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('Detalles', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.type} - $${parseFloat(item.amount).toFixed(2)}`}
        right={(props) => (
          <Text {...props} style={{ marginRight: 16, color: item.isPaid ? 'green' : 'red' }}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Total Pendiente</Title>
          <Paragraph style={styles.totalAmount}>${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas registradas.</Text>}
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('Agregar Deuda')}
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
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
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
    fontSize: 16,
    color: '#666',
  },
});
