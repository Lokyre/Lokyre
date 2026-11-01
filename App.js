import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';
import DebtDetailsScreen from './src/screens/DebtDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <NavigationContainer>
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
  );
}
