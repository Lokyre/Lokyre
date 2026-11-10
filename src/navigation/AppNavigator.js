import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtListScreen from '../screens/DebtListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
      <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Agregar Deuda' }} />
      <Stack.Screen name="DebtList" component={DebtListScreen} options={({ route }) => ({ title: route.params?.category || 'Deudas' })} />
    </Stack.Navigator>
  );
}
