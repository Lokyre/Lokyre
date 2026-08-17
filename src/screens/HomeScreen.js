import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, useTheme, Card, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import DebtItem from '../components/DebtItem';
import SummaryCard from '../components/SummaryCard';

export default function HomeScreen({ navigation }) {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  const handleAddPress = () => {
    navigation.navigate('DebtForm');
  };

  const totalDebts = debts.reduce((acc, debt) => acc + Number(debt.amount), 0);
  const totalPending = debts
    .filter((debt) => !debt.isPaid)
    .reduce((acc, debt) => acc + Number(debt.amount), 0);
  const totalPaid = debts
    .filter((debt) => debt.isPaid)
    .reduce((acc, debt) => acc + Number(debt.amount), 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SummaryCard
        totalDebts={totalDebts}
        totalPending={totalPending}
        totalPaid={totalPaid}
      />

      <View style={styles.listContainer}>
        <Title style={styles.listTitle}>Mis Deudas</Title>
        {debts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Paragraph>No tienes deudas registradas.</Paragraph>
          </View>
        ) : (
          <FlatList
            data={debts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DebtItem debt={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        color="white"
        onPress={handleAddPress}
        testID="add-debt-fab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    marginVertical: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
