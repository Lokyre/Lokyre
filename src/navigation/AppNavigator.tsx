import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';

export type RootStackParamList = {
  Home: undefined;
  AddEditDebt: { debtId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        options={({ route }) => ({ title: route.params?.debtId ? 'Editar Deuda' : 'Nueva Deuda' })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
