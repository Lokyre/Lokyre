import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Text, useTheme } from 'react-native-paper';

export default function SummaryCard({ totalDebts, totalPending, totalPaid }) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Resumen de Deudas</Title>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>${totalDebts.toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.error }]}>Pendiente</Text>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>${totalPending.toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Pagado</Text>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>${totalPaid.toFixed(2)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
    marginTop: 4,
  },
});
