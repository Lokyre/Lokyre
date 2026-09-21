import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const DebtDetailScreen = ({ route, navigation }) => {
    const { debtId } = route?.params || {};
    const { debts, togglePaidStatus, deleteDebt } = useDebts();

    const debt = debts.find(d => d.id === debtId);

    if (!debt) {
        return (
            <View style={styles.centered}>
                <Text>Deuda no encontrada.</Text>
                <Button onPress={() => navigation.goBack()} mode="text">Volver</Button>
            </View>
        );
    }

    const handleDelete = () => {
        deleteDebt(debt.id);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>{debt.name}</Title>
                    <Divider style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Monto:</Text>
                        <Text style={styles.value}>${parseFloat(debt.amount).toFixed(2)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo:</Text>
                        <Text style={styles.value}>{debt.type}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Estado:</Text>
                        <Text style={[styles.value, { color: debt.isPaid ? 'green' : 'red' }]}>
                            {debt.isPaid ? 'Pagada' : 'Pendiente'}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{new Date(debt.createdAt).toLocaleDateString()}</Text>
                    </View>

                    {debt.description ? (
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.label}>Descripción:</Text>
                            <Paragraph style={styles.descriptionText}>{debt.description}</Paragraph>
                        </View>
                    ) : null}
                </Card.Content>
            </Card>

            <View style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={() => togglePaidStatus(debt.id)}
                    style={[styles.button, debt.isPaid ? styles.unpaidButton : styles.paidButton]}
                    testID="btn-toggle-status"
                >
                    {debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
                </Button>

                <Button
                    mode="outlined"
                    color="red"
                    onPress={handleDelete}
                    style={styles.deleteButton}
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
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 16,
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    divider: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    descriptionContainer: {
        marginTop: 10,
    },
    descriptionText: {
        marginTop: 4,
        fontSize: 15,
        color: '#444',
    },
    actions: {
        padding: 16,
    },
    button: {
        marginBottom: 12,
        paddingVertical: 6,
    },
    paidButton: {
        backgroundColor: '#4caf50',
    },
    unpaidButton: {
        backgroundColor: '#ff9800',
    },
    deleteButton: {
        paddingVertical: 6,
        borderColor: '#f44336',
    }
});

export default DebtDetailScreen;
