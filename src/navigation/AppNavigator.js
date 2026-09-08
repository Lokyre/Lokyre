import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Mis Deudas' }}
        />
        <Stack.Screen
          name="AddEditDebt"
          component={AddEditDebtScreen}
          options={{ title: 'Detalle de Deuda' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
