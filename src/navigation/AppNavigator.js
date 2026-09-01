import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';
import DebtDetailsScreen from '../screens/DebtDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
          name="AddEditDebt"
          component={AddEditDebtScreen}
          options={({ route }) => ({
            title: route.params?.debtId ? 'Editar Deuda' : 'Nueva Deuda',
          })}
        />
        <Stack.Screen
          name="DebtDetails"
          component={DebtDetailsScreen}
          options={{ title: 'Detalles de la Deuda' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}