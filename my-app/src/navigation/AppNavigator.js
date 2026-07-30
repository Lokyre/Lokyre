import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DebtFormScreen from '../screens/DebtFormScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Mis Deudas' }}
      />
      <Stack.Screen
        name="DebtForm"
        component={DebtFormScreen}
        options={({ route }) => ({
          title: route.params?.debt ? 'Editar Deuda' : 'Nueva Deuda',
        })}
      />
      <Stack.Screen
        name="DebtDetail"
        component={DebtDetailScreen}
        options={{ title: 'Detalles de la Deuda' }}
      />
    </Stack.Navigator>
  );
}
