import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import DebtsListScreen from './src/screens/DebtsListScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Debt Manager Dashboard' }}
            />
            <Stack.Screen
              name="DebtsList"
              component={DebtsListScreen}
              options={{ title: 'All Debts' }}
            />
            <Stack.Screen
              name="AddDebt"
              component={AddDebtScreen}
              options={{ title: 'Add New Debt' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
