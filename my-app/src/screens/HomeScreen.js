import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, FAB, IconButton, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, loading, removeDebt, toggleDebtStatus } = useDebts();
  const theme = useTheme();

  const getDebtTypeColor = (type) => {
    switch (type) {
      case 'Tarjeta':
        return '#FF5722';
      case 'Crédito':
        return '#4CAF50';
      case 'Persona':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const confirmRemove = (id) => {
    Alert.alert(
      'Eliminar deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => removeDebt(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`Monto: $${item.amount} | Vence: ${item.dueDate}`}
        left={(props) => (
          <IconButton
            {...props}
            icon={item.isPaid ? 'check-circle' : 'circle-outline'}
            iconColor={item.isPaid ? theme.colors.primary : theme.colors.error}
            onPress={() => toggleDebtStatus(item.id)}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => confirmRemove(item.id)}
          />
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium">{item.description}</Text>
        <View style={styles.chipContainer}>
          <Chip
            style={{ backgroundColor: getDebtTypeColor(item.type) }}
            textStyle={{ color: 'white' }}
          >
            {item.type}
          </Chip>
          {item.isPaid && (
            <Chip style={styles.paidChip} textStyle={{ color: 'white' }}>
              Pagado
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text variant="titleMedium">No hay deudas registradas.</Text>
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
        icon="plus"
        testID="fab"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDebt')}
      />
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
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  paidChip: {
    backgroundColor: '#4CAF50',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
