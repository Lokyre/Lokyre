import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, useTheme, IconButton } from 'react-native-paper';
import { DebtContext } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debtId } = route.params;
  const { debts, deleteDebt } = useContext(DebtContext);
  const theme = useTheme();

  const debt = debts.find(d => d.id === debtId);

  if (!debt) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleLarge">Deuda no encontrada</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          Volver
        </Button>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que quieres eliminar esta deuda? Esta acción no se puede deshacer.",
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{debt.title}</Title>
          <Text variant="displayMedium" style={[styles.amount, { color: theme.colors.error }]}>
            ${debt.amount.toFixed(2)}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={styles.label}>Categoría:</Text>
            <Text variant="bodyLarge">{debt.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={styles.label}>Fecha de registro:</Text>
            <Text variant="bodyMedium">{new Date(debt.createdAt).toLocaleDateString()}</Text>
          </View>

          {debt.description ? (
            <View style={styles.descriptionContainer}>
              <Text variant="labelLarge" style={styles.label}>Descripción:</Text>
              <Paragraph style={styles.description}>{debt.description}</Paragraph>
            </View>
          ) : null}

        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('AddDebt', { debtId: debt.id })}
          style={styles.actionButton}
          buttonColor={theme.colors.primary}
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          textColor={theme.colors.error}
          onPress={handleDelete}
          style={styles.actionButton}
        >
          Eliminar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  amount: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#666',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    marginTop: 4,
    color: '#333',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  }
});

export default DebtDetailScreen;
