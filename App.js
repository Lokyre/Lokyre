import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Mis Deudas">
              <Stack.Screen name="Mis Deudas" component={HomeScreen} />
              <Stack.Screen name="Agregar Deuda" component={AddDebtScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
