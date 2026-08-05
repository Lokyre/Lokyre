import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Mis Deudas">
            <Stack.Screen name="Mis Deudas" component={HomeScreen} />
            <Stack.Screen name="Agregar Deuda" component={AddDebtScreen} />
            <Stack.Screen name="Detalles" component={DebtDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
