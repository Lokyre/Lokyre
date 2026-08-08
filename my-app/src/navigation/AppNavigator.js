import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
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
        name="AddEditDebt"
        component={AddEditDebtScreen}
        options={({ route }) => ({ title: route.params?.id ? 'Editar Deuda' : 'Nueva Deuda' })}
      />
      <Stack.Screen
        name="DebtDetail"
        component={DebtDetailScreen}
        options={{ title: 'Detalles de la Deuda' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
