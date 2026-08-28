import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme, Button } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';

import HomeScreen from './src/screens/HomeScreen';
import DebtListScreen from './src/screens/DebtListScreen';
import AddEditDebtScreen from './src/screens/AddEditDebtScreen';
import DebtDetailsScreen from './src/screens/DebtDetailsScreen';

const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DebtProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  title: 'Mis Deudas',
                  headerRight: () => (
                    <Button onPress={() => navigation.navigate('DebtList')}>Ver Todo</Button>
                  ),
                })}
              />
              <Stack.Screen
                name="DebtList"
                component={DebtListScreen}
                options={{ title: 'Lista de Deudas' }}
              />
              <Stack.Screen
                name="AddEditDebt"
                component={AddEditDebtScreen}
                options={{ title: 'Nueva Deuda' }}
              />
              <Stack.Screen
                name="DebtDetails"
                component={DebtDetailsScreen}
                options={{ title: 'Detalles' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DebtProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
