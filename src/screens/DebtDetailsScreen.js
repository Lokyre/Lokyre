import React, { useContext } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, useTheme } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

export default function DebtDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const { debts, deleteDebt } = useContext(DebtContext);
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
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta deuda?');
      if (confirmDelete) {
        deleteDebt(id);
        navigation.goBack();
      }
    } else {
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
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Categoría:</Text>
            <Text style={styles.value}>{debt.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monto:</Text>
            <Text style={[styles.value, { color: theme.colors.error, fontWeight: 'bold' }]}>
              ${parseFloat(debt.amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Fecha Registrada:</Text>
            <Text style={styles.value}>
              {new Date(debt.date).toLocaleDateString()}
            </Text>
          </View>
          {debt.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.label}>Notas:</Text>
              <Paragraph style={styles.notes}>{debt.notes}</Paragraph>
            </View>
          ) : null}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AddDebt', { id: debt.id })}
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={handleDelete}
            style={styles.actionButton}
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 16,
  },
  notes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
