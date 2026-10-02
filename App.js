import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DebtProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Mis Deudas' }}
              />
              <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={({ route }) => ({ title: route.params?.category || 'Categoría' })}
              />
              <Stack.Screen
                name="AddEditDebt"
                component={AddEditDebtScreen}
                options={({ route }) => ({ title: route.params?.debt ? 'Editar Deuda' : 'Nueva Deuda' })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DebtProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
