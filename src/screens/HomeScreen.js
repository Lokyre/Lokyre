import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Alert, Platform } from 'react-native';
import { Text, FAB, useTheme, Appbar } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import DebtItem from '../components/DebtItem';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

  const confirmDelete = (id) => {
    if (Platform.OS === 'web') {
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta deuda?");
        if (confirmed) {
            deleteDebt(id);
        }
    } else {
        Alert.alert(
            "Eliminar deuda",
            "¿Estás seguro de que quieres eliminar esta deuda?",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Eliminar", onPress: () => deleteDebt(id), style: 'destructive' }
            ]
        );
    }
  };

  const renderItem = ({ item }) => (
    <DebtItem
      debt={item}
      onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
      onDelete={confirmDelete}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <View style={[styles.summaryContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>Total Pendiente</Text>
        <Text variant="displaySmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
              No tienes deudas registradas.
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 24,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
