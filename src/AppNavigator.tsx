import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddDebtScreen from './screens/AddDebtScreen';
import DebtDetailScreen from './screens/DebtDetailScreen';
import EditDebtScreen from './screens/EditDebtScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" id={undefined}>
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
      <Stack.Screen
        name="EditDebt"
        component={EditDebtScreen}
        options={{ title: 'Editar Deuda' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
