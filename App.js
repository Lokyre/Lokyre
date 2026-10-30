import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DebtProvider } from './src/context/DebtContext';
import HomeScreen from './src/screens/HomeScreen';
import AddDebtScreen from './src/screens/AddDebtScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Inicio') iconName = 'home';
                  else if (route.name === 'Agregar') iconName = 'plus-circle';
                  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Mis Deudas' }} />
              <Tab.Screen name="Agregar" component={AddDebtScreen} options={{ title: 'Agregar Deuda' }} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
