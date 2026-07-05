import "react-native-gesture-handler";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DebtProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddEditDebt" component={AddEditDebtScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </DebtProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
