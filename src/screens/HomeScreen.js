import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text as RNText } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Tarjetas':
      return 'credit-card-outline';
    case 'Créditos':
      return 'bank-outline';
    case 'Personas':
      return 'account-outline';
    case 'Individuales':
      return 'cash-multiple';
    default:
      return 'help-circle-outline';
  }
};

const HomeScreen = ({ navigation }) => {
  const { debts, removeDebt } = useDebts();
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.description}
        subtitle={item.category}
        left={(props) => <MaterialCommunityIcons name={getCategoryIcon(item.category)} size={24} color={theme.colors.primary} />}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete-outline"
            onPress={() => removeDebt(item.id)}
            testID={`delete-btn-${item.id}`}
          />
        )}
      />
      <Card.Content>
        <Paragraph style={styles.amount}>
          ${parseFloat(item.amount).toFixed(2)}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Deudas Pendientes</Title>
        <Text style={styles.totalAmount}>Total: ${totalDebt.toFixed(2)}</Text>
      </View>

      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
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
        label="Nueva Deuda"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    color: '#d32f2f',
    marginTop: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
