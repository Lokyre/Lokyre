import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, toggleDebtStatus, deleteDebt } = useDebts();
  const theme = useTheme();

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    // Handling Alert across different environments (mobile/web)
    if (globalThis.confirm) {
      if(globalThis.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
        deleteDebt(debtId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de que quieres eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              deleteDebt(debtId);
              navigation.goBack();
            }
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Divider style={styles.divider} />

          <Paragraph style={styles.label}>Monto:</Paragraph>
          <Paragraph style={styles.value}>${debt.amount.toFixed(2)}</Paragraph>

          <Paragraph style={styles.label}>Tipo de deuda:</Paragraph>
          <Paragraph style={styles.value}>{debt.type}</Paragraph>

          <Paragraph style={styles.label}>Estado:</Paragraph>
          <Paragraph style={[styles.value, { color: debt.isPaid ? theme.colors.primary : theme.colors.error }]}>
            {debt.isPaid ? 'Pagado' : 'Pendiente'}
          </Paragraph>

          {debt.notes ? (
            <>
              <Paragraph style={styles.label}>Notas:</Paragraph>
              <Paragraph style={styles.value}>{debt.notes}</Paragraph>
            </>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => toggleDebtStatus(debtId)}
          style={styles.button}
          color={debt.isPaid ? theme.colors.error : theme.colors.primary}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditDebt', { debtId: debt.id })}
          style={styles.button}
        >
          Editar Deuda
        </Button>

        <Button
          mode="text"
          textColor={theme.colors.error}
          onPress={handleDelete}
          style={styles.button}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  button: {
    marginBottom: 15,
    paddingVertical: 5,
  },
});

export default DebtDetailScreen;
