import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';

const Stack = createStackNavigator();

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
        options={({ route }) => ({
          title: route.params?.debt ? 'Editar Deuda' : 'Nueva Deuda'
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
