import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDebts } from '../context/DebtContext';

const AddDebtScreen = ({ navigation }) => {
    const { addDebt } = useDebts();
    const theme = useTheme();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Tarjetas');

    const handleSave = () => {
        if (!name.trim() || !amount.trim()) {
            if (globalThis.alert) {
                 globalThis.alert('Error: Por favor ingresa el nombre y el monto.');
            } else {
                 Alert.alert('Error', 'Por favor ingresa el nombre y el monto.');
            }
            return;
        }

        const parsedAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            if (globalThis.alert) {
                 globalThis.alert('Error: Ingresa un monto válido.');
            } else {
                 Alert.alert('Error', 'Ingresa un monto válido.');
            }
            return;
        }

        addDebt({
            name: name.trim(),
            amount: parsedAmount,
            description: description.trim(),
            type,
        });

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TextInput
                    label="Nombre / Titular"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    testID="input-name"
                />

                <TextInput
                    label="Monto"
                    value={amount}
                    onChangeText={setAmount}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                    testID="input-amount"
                />

                <TextInput
                    label="Descripción (Opcional)"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline={true}
                    numberOfLines={3}
                    style={styles.input}
                    testID="input-description"
                />

                <Text style={styles.sectionTitle}>Tipo de Deuda</Text>

                <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="Tarjetas" value="Tarjetas" mode="android" testID="radio-tarjetas" />
                    </View>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="Créditos" value="Créditos" mode="android" testID="radio-creditos" />
                    </View>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="Personas" value="Personas" mode="android" testID="radio-personas" />
                    </View>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="Individuales" value="Individuales" mode="android" testID="radio-individuales" />
                    </View>
                </RadioButton.Group>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    testID="btn-save"
                >
                    Guardar Deuda
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    input: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    radioRow: {
        marginBottom: 4,
    },
    saveButton: {
        marginTop: 30,
        paddingVertical: 6,
    }
});

export default AddDebtScreen;
