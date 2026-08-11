import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddEditDebtScreen } from './src/screens/AddEditDebtScreen';

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
              options={{ title: 'Mis Deudas' }}
            />
            <Stack.Screen
              name="AddEditDebt"
              component={AddEditDebtScreen}
              options={({ route }) => ({
                title: route.params?.debtId ? 'Editar Deuda' : 'Nueva Deuda'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
