import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DebtProvider } from './context/DebtContext';
import { HomeScreen } from './screens/HomeScreen';
import { AddDebtScreen } from './screens/AddDebtScreen';
import { DebtDetailsScreen } from './screens/DebtDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DebtProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Inicio">
              <Stack.Screen
                name="Inicio"
                component={HomeScreen}
                options={{ title: 'Mis Deudas' }}
              />
              <Stack.Screen
                name="AgregarDeuda"
                component={AddDebtScreen}
                options={{ title: 'Nueva Deuda' }}
              />
              <Stack.Screen
                name="DetallesDeuda"
                component={DebtDetailsScreen}
                options={{ title: 'Detalles' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DebtProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
