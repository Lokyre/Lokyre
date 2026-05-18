import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import DebtFormScreen from './src/screens/DebtFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
            <Stack.Screen name="DebtForm" component={DebtFormScreen} options={{ title: 'Deuda' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
