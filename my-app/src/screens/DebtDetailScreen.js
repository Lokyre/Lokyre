import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, Button, Divider, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { debts, deleteDebt, markAsPaid } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe o fue eliminada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Deuda',
      '¿Estás seguro de que deseas eliminar esta deuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(id);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Cantidad:</Text>
            <Text style={{ ...styles.value, color: debt.isPaid ? 'green' : theme.colors.error }}>
              ${debt.amount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value}>{new Date(debt.dueDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={{ ...styles.value, color: debt.isPaid ? 'green' : theme.colors.primary }}>
              {debt.isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.description}>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.actionBtn}
            buttonColor="green"
          >
            Marcar como Pagado
          </Button>
        )}

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddEditDebt', { id: debt.id })}
          style={styles.actionBtn}
        >
          Editar Deuda
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.actionBtn}
          textColor={theme.colors.error}
        >
          Eliminar Deuda
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    fontStyle: 'italic',
  },
  actions: {
    paddingBottom: 32,
  },
  actionBtn: {
    marginBottom: 12,
  },
});

export default DebtDetailScreen;
