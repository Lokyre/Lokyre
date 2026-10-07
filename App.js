import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1976d2',
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
                name="AddDebt"
                component={AddDebtScreen}
                options={{ title: 'Agregar Deuda' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
