import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
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
      <Stack.Screen
        name="DebtDetail"
        component={DebtDetailScreen}
        options={{ title: 'Detalles de la Deuda' }}
      />
    </Stack.Navigator>
  );
}
