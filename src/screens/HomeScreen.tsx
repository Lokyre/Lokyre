import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, Button, Menu, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { Debt, DebtType } from '../types/Debt';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  AddEditDebt: { debtId?: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const DebtCard = ({ debt, onPress }: { debt: Debt; onPress: () => void }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content>
      <Title>{debt.name}</Title>
      <Paragraph>Tipo: {debt.type}</Paragraph>
      <Paragraph>Monto: ${debt.amount.toFixed(2)}</Paragraph>
      <Paragraph>Vencimiento: {debt.dueDate}</Paragraph>
    </Card.Content>
  </Card>
);

const HomeScreen = () => {
  const { debts, isLoaded } = useContext(DebtContext);
  const navigation = useNavigation<NavigationProp>();
  const [filterType, setFilterType] = useState<DebtType | 'Todas'>('Todas');
  const [menuVisible, setMenuVisible] = useState(false);

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <Text>Cargando deudas...</Text>
      </View>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const filteredDebts = filterType === 'Todas'
    ? debts
    : debts.filter(debt => debt.type === filterType);

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Total a pagar</Title>
          <Text style={styles.summaryAmount}>${totalDebt.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Button mode="outlined" onPress={() => setMenuVisible(true)}>Filtro: {filterType}</Button>}>
          <Menu.Item onPress={() => { setFilterType('Todas'); setMenuVisible(false); }} title="Todas" />
          <Divider />
          <Menu.Item onPress={() => { setFilterType('Tarjetas'); setMenuVisible(false); }} title="Tarjetas" />
          <Menu.Item onPress={() => { setFilterType('Créditos'); setMenuVisible(false); }} title="Créditos" />
          <Menu.Item onPress={() => { setFilterType('Personas'); setMenuVisible(false); }} title="Personas" />
          <Menu.Item onPress={() => { setFilterType('Individuales'); setMenuVisible(false); }} title="Individuales" />
        </Menu>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onPress={() => navigation.navigate('AddEditDebt', { debtId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No hay deudas {filterType !== 'Todas' ? 'de este tipo' : ''}</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt', {})}
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
    padding: 20,
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#6200ee',
  },
  summaryTitle: {
    color: 'white',
    textAlign: 'center',
  },
  summaryAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
