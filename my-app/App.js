import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e88e5',
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
            options={{ title: 'My Debts' }}
          />
          <Stack.Screen
            name="AddEditDebt"
            component={AddEditDebtScreen}
            options={({ route }) => ({ title: route.params?.debt ? 'Edit Debt' : 'Add Debt' })}
          />
          <Stack.Screen
            name="DebtDetail"
            component={DebtDetailScreen}
            options={{ title: 'Debt Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DebtProvider>
  );
}
