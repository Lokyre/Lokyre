import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const DebtDetailScreen = () => {
  const { debts, toggleDebtPaid, deleteDebt } = useContext(DebtContext);
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();

  const { id } = route.params;
  const debt = debts.find(d => d.id === id);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteDebt(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={styles.value}>${debt.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{debt.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Vencimiento:</Text>
            <Text style={styles.value}>{new Date(debt.dueDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, { color: debt.isPaid ? 'green' : theme.colors.error }]}>
              {debt.isPaid ? 'Pagada' : 'Pendiente'}
            </Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => toggleDebtPaid(id)}
          style={[styles.button, { backgroundColor: debt.isPaid ? 'orange' : 'green' }]}
        >
          {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
        </Button>

        <Button
          mode="outlined"
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
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 15,
    paddingVertical: 5,
  },
});

export default DebtDetailScreen;
