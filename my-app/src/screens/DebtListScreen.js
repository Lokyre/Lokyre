import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { List, IconButton, Text, Divider, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtListScreen = ({ route, navigation }) => {
  const { debts, deleteDebt } = useDebts();
  const theme = useTheme();

  const categoryFilter = route.params?.category;

  const filteredDebts = categoryFilter
    ? debts.filter((d) => d.category === categoryFilter)
    : debts;

  const handleDelete = (id, title) => {
    Alert.alert(
      'Eliminar Deuda',
      `¿Estás seguro que deseas eliminar "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteDebt(id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${item.category.charAt(0).toUpperCase() + item.category.slice(1)} - Vence: ${item.dueDate || 'N/A'}`}
      right={props => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 8, color: theme.colors.error, fontWeight: 'bold' }}>
            ${Number(item.amount).toFixed(2)}
          </Text>
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={20}
            onPress={() => handleDelete(item.id, item.title)}
            testID={`delete-${item.id}`}
          />
        </View>
      )}
      onPress={() => {
        // Podríamos navegar a un detalle aquí si es necesario
      }}
    />
  );

  return (
    <View style={styles.container}>
      {filteredDebts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No hay deudas en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DebtListScreen;
