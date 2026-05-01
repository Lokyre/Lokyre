import 'react-native-get-random-values';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddDebtScreen from './screens/AddDebtScreen';
import DebtDetailScreen from './screens/DebtDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
        <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Agregar Deuda' }} />
        <Stack.Screen name="DebtDetail" component={DebtDetailScreen} options={{ title: 'Detalle de Deuda' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
