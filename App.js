import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DebtProvider } from './DebtContext';
import HomeScreen from './HomeScreen';
import AddEditDebtScreen from './AddEditDebtScreen';
import DebtDetailScreen from './DebtDetailScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006064',
    secondary: '#00bcd4',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddEditDebt" component={AddEditDebtScreen} />
              <Stack.Screen name="DebtDetail" component={DebtDetailScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
