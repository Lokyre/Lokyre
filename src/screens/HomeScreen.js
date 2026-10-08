import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, FAB, Text, Card, Title, Paragraph, useTheme, List } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
  const { debts, isLoaded } = useDebts();
  const theme = useTheme();

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <Text>Cargando deudas...</Text>
      </View>
    );
  }

  const activeDebts = debts.filter((d) => !d.isPaid);
  const totalDebt = activeDebts.reduce((sum, debt) => sum + Number(debt.amount), 0);

  const debtsByType = {
    Tarjetas: activeDebts.filter((d) => d.type === 'Tarjetas'),
    Créditos: activeDebts.filter((d) => d.type === 'Créditos'),
    Personas: activeDebts.filter((d) => d.type === 'Personas'),
    Individuales: activeDebts.filter((d) => d.type === 'Individuales'),
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Tarjetas':
        return 'credit-card';
      case 'Créditos':
        return 'bank';
      case 'Personas':
        return 'account';
      case 'Individuales':
        return 'file-document';
      default:
        return 'cash';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Mis Deudas" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Total Pendiente</Title>
            <Paragraph style={styles.summaryAmount}>
              ${totalDebt.toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>

        {Object.keys(debtsByType).map((type) => (
          <List.Accordion
            key={type}
            title={`${type} (${debtsByType[type].length})`}
            left={(props) => <List.Icon {...props} icon={getIconForType(type)} />}
            id={type}
          >
            {debtsByType[type].map((debt) => (
              <List.Item
                key={debt.id}
                title={debt.title}
                description={`$${Number(debt.amount).toFixed(2)}`}
                onPress={() => navigation.navigate('DebtDetails', { debtId: debt.id })}
                left={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            ))}
            {debtsByType[type].length === 0 && (
              <List.Item title="No hay deudas de este tipo" />
            )}
          </List.Accordion>
        ))}
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        testID="fab-add-debt"
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  summaryTitle: {
    textAlign: 'center',
    fontSize: 18,
  },
  summaryAmount: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
