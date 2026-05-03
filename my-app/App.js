import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'My Debts' }}
          />
          <Stack.Screen
            name="AddDebt"
            component={AddDebtScreen}
            options={{ title: 'Add New Debt' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DebtProvider>
  );
}
