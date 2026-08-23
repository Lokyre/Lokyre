import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Title, Paragraph } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { debts } = useContext(DebtContext);
  const navigation = useNavigation();

  const totalDebt = debts.reduce((acc, debt) => acc + parseFloat(debt.amount || 0), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
      testID={`debt-card-${item.id}`}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Monto: ${parseFloat(item.amount).toFixed(2)}</Paragraph>
        <Paragraph>Categoría: {item.category}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Resumen de Deudas</Title>
          <Paragraph>Total Pendiente: ${totalDebt.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditDebt')}
        testID="add-debt-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#e0f7fa',
  },
  list: {
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
