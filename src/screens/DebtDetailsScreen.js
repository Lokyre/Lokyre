import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider, useTheme, IconButton } from 'react-native-paper';
import { useDebtContext } from '../context/DebtContext';
import { getDebtIcon } from '../components/DebtCard';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debtId } = route?.params || {};
  const { debts, deleteDebt, markAsPaid } = useDebtContext();
  const theme = useTheme();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>La deuda no existe o fue eliminada.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const isOverdue = new Date(debt.dueDate) < new Date() && debt.status !== 'Pagado';

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
            deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(debt.id);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="pencil"
            onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
            testID="edit-icon"
          />
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            onPress={handleDelete}
            testID="delete-icon"
          />
        </View>
      ),
    });
  }, [navigation, debt, theme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Title
          title={debt.title}
          subtitle={debt.type}
          left={(props) => <IconButton {...props} icon={getDebtIcon(debt.type)} />}
        />
        <Card.Content>
          <View style={styles.amountContainer}>
            <Text variant="headlineMedium" style={[
              styles.amount,
              { color: debt.status === 'Pagado' ? theme.colors.outline : theme.colors.error }
            ]}>
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
            <Text
              variant="labelLarge"
              style={[
                styles.statusBadge,
                {
                  backgroundColor: debt.status === 'Pagado' ? theme.colors.primaryContainer : theme.colors.errorContainer,
                  color: debt.status === 'Pagado' ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer
                }
              ]}
            >
              {debt.status}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text variant="titleSmall" style={styles.detailLabel}>Vencimiento:</Text>
            <Text
              variant="bodyLarge"
              style={{ color: isOverdue ? theme.colors.error : theme.colors.onSurface }}
            >
              {new Date(debt.dueDate).toLocaleDateString()}
              {isOverdue ? ' (Vencido)' : ''}
            </Text>
          </View>

          {debt.description ? (
            <>
              <View style={styles.detailRow}>
                <Text variant="titleSmall" style={styles.detailLabel}>Descripción:</Text>
              </View>
              <Text variant="bodyMedium" style={styles.description}>
                {debt.description}
              </Text>
            </>
          ) : null}

        </Card.Content>
      </Card>

      {debt.status !== 'Pagado' && (
        <Button
          mode="contained"
          icon="check-circle"
          style={styles.actionButton}
          onPress={handleMarkAsPaid}
          testID="mark-paid-button"
        >
          Marcar como Pagado
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    marginBottom: 24,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  amount: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButton: {
    marginTop: 8,
  },
});

export default DebtDetailsScreen;
