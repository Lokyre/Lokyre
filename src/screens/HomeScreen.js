import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts } = useContext(DebtContext);
  const theme = useTheme();

  // Calcular totales
  const totalOwedToMe = debts
    .filter((d) => d.isOwedToMe && !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const totalIOwe = debts
    .filter((d) => !d.isOwedToMe && !d.isPaid)
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Entidad/Persona: {item.entity}</Paragraph>
        <Paragraph>Monto: ${item.amount}</Paragraph>
        <Paragraph>
          Tipo: {item.type === 'credit_card' ? 'Tarjeta de Crédito' : item.type === 'loan' ? 'Préstamo' : 'Personal'}
        </Paragraph>
        <Paragraph
          style={{
            color: item.isOwedToMe ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {item.isOwedToMe ? 'Me deben' : 'Debo'}
        </Paragraph>
        {item.isPaid && <Paragraph style={{ color: 'gray' }}>Pagado</Paragraph>}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Resumen</Title>
          <Text style={{ color: 'green', fontSize: 16 }}>
            Me deben: ${totalOwedToMe.toFixed(2)}
          </Text>
          <Text style={{ color: 'red', fontSize: 16 }}>
            Debo: ${totalIOwe.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay deudas registradas.</Text>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddDebt')}
        testID="fab-add"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
