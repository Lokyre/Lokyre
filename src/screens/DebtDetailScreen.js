import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = () => {
  const { debts, deleteDebt, markAsPaid, markAsUnpaid } = useContext(DebtContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { debtId } = route?.params || {};

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.centered}>
        <Text>Deuda no encontrada.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro que deseas eliminar esta deuda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteDebt(debt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const getDebtTypeLabel = (type) => {
    switch(type) {
      case 'tarjeta': return 'Tarjeta de Crédito';
      case 'credito': return 'Crédito/Préstamo';
      case 'persona': return 'Persona';
      default: return 'Otro';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>{debt.title}</Title>
            <IconButton
              icon="pencil"
              size={24}
              onPress={() => navigation.navigate('AddEditDebt', { debtId: debt.id })}
            />
          </View>

          <Text style={[styles.amount, debt.isPaid && styles.paidAmount]}>
            ${parseFloat(debt.amount).toFixed(2)}
          </Text>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusBadge, debt.isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
              {debt.isPaid ? "PAGADA" : "PENDIENTE"}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo:</Text>
            <Text style={styles.detailValue}>{getDebtTypeLabel(debt.type)}</Text>
          </View>

          {debt.dueDate ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vencimiento:</Text>
              <Text style={styles.detailValue}>{new Date(debt.dueDate).toLocaleDateString()}</Text>
            </View>
          ) : null}}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de registro:</Text>
            <Text style={styles.detailValue}>{new Date(debt.createdAt).toLocaleDateString()}</Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Descripción:</Text>
              <Paragraph>{debt.description}</Paragraph>
            </View>
          ) : null}

        </Card.Content>
        <Card.Actions style={styles.actions}>
          {debt.isPaid ? (
            <Button mode="outlined" onPress={() => markAsUnpaid(debt.id)} style={styles.actionBtn}>
              Marcar Pendiente
            </Button>
          ) : (
            <Button mode="contained" onPress={() => markAsPaid(debt.id)} style={styles.actionBtn} color="#388e3c">
              Marcar Pagada
            </Button>
          )}
          <Button mode="text" color="#d32f2f" onPress={handleDelete} style={styles.actionBtn}>
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 8,
  },
  paidAmount: {
    color: '#388e3c',
    textDecorationLine: 'line-through',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  badgePaid: {
    backgroundColor: '#388e3c',
  },
  badgeUnpaid: {
    backgroundColor: '#d32f2f',
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionBtn: {
    marginVertical: 4,
  },
});

export default DebtDetailScreen;
