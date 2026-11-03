import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
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
  );
};

export default AppNavigator;
