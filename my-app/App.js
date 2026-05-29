import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DebtProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Mis Deudas', headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}
              />
              <Stack.Screen
                name="AddDebt"
                component={AddDebtScreen}
                options={{ title: 'Nueva Deuda', headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}
              />
              <Stack.Screen
                name="DebtDetail"
                component={DebtDetailScreen}
                options={{ title: 'Detalle de Deuda', headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DebtProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
