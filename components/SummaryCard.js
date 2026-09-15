import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

export const SummaryCard = ({ totalPending, totalPaid }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Resumen de Deudas
        </Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text variant="labelLarge" style={{ color: theme.colors.error }}>
              Pendiente
            </Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
              ${totalPending.toFixed(2)}
            </Text>
          </View>

          <View style={styles.col}>
            <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
              Pagado
            </Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              ${totalPaid.toFixed(2)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  col: {
    alignItems: 'center',
  },
});
