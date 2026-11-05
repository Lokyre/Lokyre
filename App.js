import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailsScreen from './src/screens/DebtDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
              options={({ route }) => ({ title: route.params?.id ? 'Editar Deuda' : 'Nueva Deuda' })}
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
  );
}
