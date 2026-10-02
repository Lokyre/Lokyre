import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, IconButton, Text, useTheme } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route?.params || {};
  const { debts, deleteDebt } = useDebtContext();
  const theme = useTheme();

  const categoryDebts = debts.filter((debt) => debt.category === category);

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
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('AddEditDebt', { debt: item })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Title>{item.title}</Title>
          {item.dueDate ? (
            <Paragraph>Vence: {new Date(item.dueDate).toLocaleDateString()}</Paragraph>
          ) : null}
          {item.description ? <Paragraph>{item.description}</Paragraph> : null}
        </View>
        <View style={styles.actionsContainer}>
          <Text style={[styles.amount, { color: theme.colors.error }]}>
            ${Number(item.amount).toFixed(2)}
          </Text>
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={24}
            onPress={() => handleDelete(item.id)}
            testID={`delete-debt-${item.id}`}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {categoryDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={categoryDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  actionsContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;
