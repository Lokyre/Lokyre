import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailsScreen from './src/screens/DebtDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider>
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
                options={{ title: 'Nueva Deuda' }}
              />
              <Stack.Screen
                name="DebtDetails"
                component={DebtDetailsScreen}
                options={{ title: 'Detalles' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
