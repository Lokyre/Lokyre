import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt, addPayment } = useContext(DebtContext);

  const debt = debts.find(d => d.id === debtId);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!debt) {
    return (
      <View style={styles.container}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const paidAmount = (debt.payments || []).reduce((sum, p) => sum + p.amount, 0);
  const remaining = debt.totalAmount - paidAmount;

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(debtId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido mayor a 0.");
      return;
    }
    if (amount > remaining) {
      Alert.alert("Error", "El pago no puede ser mayor a la deuda pendiente.");
      return;
    }

    await addPayment(debtId, amount);
    setPaymentAmount('');
    Alert.alert("Éxito", "Pago registrado correctamente.");
  };

  const handleFullPayment = async () => {
    if (remaining <= 0) return;

    Alert.alert(
      "Pago Total",
      `¿Confirmas el pago total de $${remaining.toFixed(2)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            await addPayment(debtId, remaining);
            Alert.alert("Éxito", "Deuda pagada en su totalidad.");
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.detailText}>Tipo: <Text style={{fontWeight: 'bold'}}>{debt.type}</Text></Paragraph>
          <Paragraph style={styles.detailText}>Total Original: <Text style={{fontWeight: 'bold'}}>${debt.totalAmount.toFixed(2)}</Text></Paragraph>
          <Paragraph style={styles.detailText}>Total Pagado: <Text style={{fontWeight: 'bold'}}>${paidAmount.toFixed(2)}</Text></Paragraph>
          <Paragraph style={[styles.detailText, { fontSize: 18, marginTop: 10 }]}>
            Pendiente: <Text style={{fontWeight: 'bold', color: remaining === 0 ? 'green' : 'red'}}>${remaining.toFixed(2)}</Text>
          </Paragraph>
          {debt.dueDate ? <Paragraph style={styles.detailText}>Vencimiento: <Text style={{fontWeight: 'bold'}}>{debt.dueDate}</Text></Paragraph> : null}
        </Card.Content>
      </Card>

      {remaining > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Abonar a la deuda</Title>
            <TextInput
              label="Monto del abono"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddPayment} style={styles.button} buttonColor="#03dac6">
              Registrar Abono
            </Button>
            <Button mode="contained" onPress={handleFullPayment} style={styles.button} buttonColor="#4caf50">
              Liquidar Deuda Completa
            </Button>
          </Card.Content>
        </Card>
      )}

      <Button mode="outlined" onPress={handleDelete} style={styles.deleteButton} textColor="red" borderColor="red">
        Eliminar Deuda
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 20,
    borderColor: 'red',
  }
});

export default DebtDetailScreen;
