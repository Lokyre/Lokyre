import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Paragraph, Button, Text } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params;
  const { markAsPaid, deleteDebt } = useContext(DebtContext);

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de marcar esta deuda como pagada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, pagada',
          onPress: async () => {
            await markAsPaid(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de eliminar esta deuda permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDebt(debt.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title} testID="detail-title">{debt.title}</Title>

        <View style={styles.row}>
          <Text style={styles.label}>Monto:</Text>
          <Text style={styles.value} testID="detail-amount">${parseFloat(debt.amount).toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value} testID="detail-type">{debt.type}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]} testID="detail-status">
            {debt.isPaid ? 'Pagada' : 'Pendiente'}
          </Text>
        </View>

        {debt.dueDate ? (
          <View style={styles.row}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value} testID="detail-date">{debt.dueDate}</Text>
          </View>
        ) : null}

        {debt.description ? (
          <View style={styles.section}>
            <Text style={styles.label}>Descripción:</Text>
            <Paragraph testID="detail-desc">{debt.description}</Paragraph>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        {!debt.isPaid && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            style={styles.button}
            testID="btn-pay"
          >
            Marcar como Pagada
          </Button>
        )}

        <Button
          mode="outlined"
          onPress={handleDelete}
          color="red"
          style={styles.button}
          testID="btn-delete"
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
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  section: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  actions: {
    marginTop: 10,
  },
  button: {
    marginBottom: 15,
  },
});

export default DebtDetailScreen;
