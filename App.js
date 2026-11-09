import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import DebtListScreen from './src/screens/DebtListScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Gestor de Deudas' }}
            />
            <Stack.Screen
              name="DebtList"
              component={DebtListScreen}
              options={({ route }) => ({ title: `Deudas: ${route.params.category}` })}
            />
            <Stack.Screen
              name="AddDebt"
              component={AddDebtScreen}
              options={({ route }) => ({ title: route.params?.debt ? 'Editar Deuda' : 'Nueva Deuda' })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
