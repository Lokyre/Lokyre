import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, ActivityIndicator, IconButton, useTheme, Chip } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, togglePaidStatus } = useDebts();
  const theme = useTheme();

  const pendingDebts = useMemo(() => debts.filter(d => !d.isPaid), [debts]);
  const totalDebt = useMemo(() => pendingDebts.reduce((sum, d) => sum + Number(d.amount), 0), [pendingDebts]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
        style={styles.card}
        onPress={() => navigation.navigate('DebtDetail', { id: item.id })}
        testID={`debt-card-${item.id}`}
    >
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount}`}
        right={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'circle-outline'}
            onPress={() => togglePaidStatus(item.id)}
            testID={`toggle-status-${item.id}`}
            iconColor={item.isPaid ? 'green' : 'gray'}
          />
        )}
      />
      <Card.Content>
         <Chip icon="tag" style={styles.chip}>{item.category}</Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Total Pendiente</Title>
        <Text style={[styles.totalAmount, { color: theme.colors.error }]}>
            ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={pendingDebts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay deudas pendientes</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="fab-add-debt"
        label="Agregar"
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
