import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Mis Deudas' }}
      />
      <Stack.Screen
        name="AddDebt"
        component={AddDebtScreen}
        options={{ title: 'Agregar Deuda' }}
      />
    </Stack.Navigator>
  );
}
