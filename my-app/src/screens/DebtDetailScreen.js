import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card, Chip, useTheme, Text } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, togglePaidStatus } = useDebts();
  const theme = useTheme();

  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar deuda",
      "¿Estás seguro de que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleToggleStatus = async () => {
    await togglePaidStatus(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Text style={[styles.amount, { color: theme.colors.error }]}>
            ${Number(debt.amount).toFixed(2)}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Categoría:</Text>
            <Chip icon="tag">{debt.category}</Chip>
          </View>

          <View style={styles.row}>
             <Text style={styles.label}>Estado:</Text>
             <Chip icon={debt.isPaid ? "check" : "alert-circle"}
                   style={debt.isPaid ? styles.paidChip : styles.pendingChip}
                   textStyle={{ color: 'white' }}>
                 {debt.isPaid ? 'Pagada' : 'Pendiente'}
             </Chip>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}

        </Card.Content>
        <Card.Actions style={styles.actions}>
            <Button
                icon="pencil"
                mode="outlined"
                onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
                testID="btn-edit"
            >
                Editar
            </Button>
            <Button
                icon="delete"
                mode="outlined"
                textColor={theme.colors.error}
                onPress={handleDelete}
                testID="btn-delete"
            >
                Eliminar
            </Button>
        </Card.Actions>
      </Card>

      <Button
        mode="contained"
        style={[styles.mainButton, { backgroundColor: debt.isPaid ? '#757575' : theme.colors.primary }]}
        onPress={handleToggleStatus}
        testID="btn-toggle-status"
      >
        {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
    color: '#555'
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actions: {
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  mainButton: {
    paddingVertical: 8,
  },
  paidChip: {
      backgroundColor: '#4CAF50'
  },
  pendingChip: {
      backgroundColor: '#FF9800'
  }
});

export default DebtDetailScreen;
