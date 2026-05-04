import 'react-native-get-random-values';
import React from 'react';
import { DebtProvider } from './src/context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
          <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Agregar Deuda' }} />
          <Stack.Screen name="DebtDetail" component={DebtDetailScreen} options={{ title: 'Detalle de Deuda' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </DebtProvider>
  );
}
