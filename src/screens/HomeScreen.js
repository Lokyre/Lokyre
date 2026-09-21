import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const HomeScreen = ({ navigation }) => {
    const { debts, isLoaded } = useDebts();
    const theme = useTheme();

    if (!isLoaded) {
        return (
            <View style={styles.centered}>
                <Text>Cargando deudas...</Text>
            </View>
        );
    }

    const totalDeudas = debts.reduce((sum, debt) => {
        if (!debt.isPaid) {
            return sum + parseFloat(debt.amount || 0);
        }
        return sum;
    }, 0);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            testID={`debt-item-${item.id}`}
            onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
        >
            <Card style={[styles.card, item.isPaid ? styles.paidCard : null]}>
                <Card.Content>
                    <Title style={item.isPaid ? styles.paidText : null}>{item.name}</Title>
                    <Paragraph style={item.isPaid ? styles.paidText : null}>
                        ${parseFloat(item.amount).toFixed(2)} - {item.type}
                    </Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Total Pendiente</Text>
                <Text style={styles.summaryAmount}>${totalDeudas.toFixed(2)}</Text>
            </View>

            <FlatList
                data={debts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay deudas registradas.</Text>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AddDebt')}
                testID="add-debt-fab"
            />
        </View>
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
    summaryContainer: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    summaryTitle: {
        fontSize: 18,
        color: '#666',
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginTop: 8,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
    },
    paidCard: {
        opacity: 0.6,
        backgroundColor: '#e0e0e0',
    },
    paidText: {
        textDecorationLine: 'line-through',
        color: '#777',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default HomeScreen;
