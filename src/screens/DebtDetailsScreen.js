import React, { useContext } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailsScreen = ({ route, navigation }) => {
  const { debts, deleteDebt } = useContext(DebtContext);
  const { debtId } = route?.params || {};

  const debt = debts.find((d) => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centerContainer}>
        <Text>No se encontró la deuda.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('¿Estás seguro de eliminar esta deuda?');
      if (confirm) {
        deleteDebt(debtId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Eliminar Deuda',
        '¿Estás seguro de eliminar esta deuda?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              deleteDebt(debtId);
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.name}</Title>
          <View style={styles.detailRow}>
            <Paragraph style={styles.label}>Monto:</Paragraph>
            <Paragraph style={styles.value}>${debt.amount.toFixed(2)}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <Paragraph style={styles.label}>Tipo:</Paragraph>
            <Paragraph style={styles.value}>{debt.type}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <Paragraph style={styles.label}>Fecha:</Paragraph>
            <Paragraph style={styles.value}>
              {new Date(debt.date).toLocaleDateString()}
            </Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            color="#d32f2f"
            onPress={handleDelete}
            style={styles.deleteBtn}
          >
            Eliminar / Marcar Resuelta
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  deleteBtn: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#d32f2f',
  }
});

export default DebtDetailsScreen;
