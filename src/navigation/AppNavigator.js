import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerStyle: { backgroundColor: '#f4511e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
      <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Añadir Deuda' }} />
      <Stack.Screen name="DebtDetail" component={DebtDetailScreen} options={{ title: 'Detalles de la Deuda' }} />
    </Stack.Navigator>
  );
}
