import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtDetailsScreen from '../screens/DebtDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
        <Stack.Screen
          name="DebtDetails"
          component={DebtDetailsScreen}
          options={{ title: 'Detalles de la Deuda' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
