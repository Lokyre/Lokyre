import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
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
      <Stack.Screen
        name="DebtDetail"
        component={DebtDetailScreen}
        options={{ title: 'Debt Details' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
