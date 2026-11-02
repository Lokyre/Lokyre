import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

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
              name="AddEditDebt"
              component={AddEditDebtScreen}
              options={{ title: 'Deuda' }}
            />
            <Stack.Screen
              name="DebtDetail"
              component={DebtDetailScreen}
              options={{ title: 'Detalle de Deuda' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
