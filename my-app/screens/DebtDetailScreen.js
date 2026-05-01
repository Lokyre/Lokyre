import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DebtDetailScreen({ route, navigation }) {
  const { debt } = route.params;

  const markAsPaid = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@debts');
      let debts = jsonValue != null ? JSON.parse(jsonValue) : [];

      const index = debts.findIndex(d => d.id === debt.id);
      if (index !== -1) {
        debts[index].status = 'paid';
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        Alert.alert('Éxito', 'Deuda marcada como pagada.');
        navigation.goBack();
      }
    } catch (e) {
      console.error('Error updating debt', e);
      Alert.alert('Error', 'No se pudo actualizar la deuda.');
    }
  };

  const deleteDebt = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const jsonValue = await AsyncStorage.getItem('@debts');
              let debts = jsonValue != null ? JSON.parse(jsonValue) : [];
              debts = debts.filter(d => d.id !== debt.id);
              await AsyncStorage.setItem('@debts', JSON.stringify(debts));
              navigation.goBack();
            } catch (e) {
              console.error('Error deleting debt', e);
              Alert.alert('Error', 'No se pudo eliminar la deuda.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{debt.name}</Text>
        <Text style={styles.amount}>${parseFloat(debt.amount).toFixed(2)}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{debt.type}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha Límite:</Text>
          <Text style={styles.value}>{debt.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, debt.status === 'paid' ? styles.paidText : styles.pendingText]}>
            {debt.status === 'paid' ? 'Pagado' : 'Pendiente'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {debt.status !== 'paid' && (
          <TouchableOpacity style={[styles.button, styles.payButton]} onPress={markAsPaid}>
            <Text style={styles.buttonText}>Marcar como Pagada</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteDebt}>
          <Text style={styles.buttonText}>Eliminar Deuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  paidText: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#f57c00',
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
