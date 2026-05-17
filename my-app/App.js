import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DebtListScreen from './src/screens/DebtListScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';

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
              options={{ title: 'Gestor de Deudas' }}
            />
            <Stack.Screen
              name="DebtList"
              component={DebtListScreen}
              options={({ route }) => ({ title: route.params?.category ? `Deudas: ${route.params.category}` : 'Todas las Deudas' })}
            />
            <Stack.Screen
              name="AddDebt"
              component={AddDebtScreen}
              options={{ title: 'Nueva Deuda' }}
            />
            <Stack.Screen
              name="DebtDetail"
              component={DebtDetailScreen}
              options={{ title: 'Detalles de Deuda' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
