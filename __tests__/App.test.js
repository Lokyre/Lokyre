import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from '../src/context/DebtContext';
import HomeScreen from '../src/screens/HomeScreen';
import AddDebtScreen from '../src/screens/AddDebtScreen';

const Stack = createNativeStackNavigator();

const TestApp = () => (
  <DebtProvider>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddDebt" component={AddDebtScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </DebtProvider>
);

describe('Debt App', () => {
  it('renders HomeScreen with empty list initially', async () => {
    const { getByText } = render(<TestApp />);
    await waitFor(() => {
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
    });
  });

  it('navigates to AddDebt screen on FAB click', async () => {
    const { getByTestId } = render(<TestApp />);
    let fab;
    await waitFor(() => {
      fab = getByTestId('add-debt-fab');
    });
    fireEvent.press(fab);
    await waitFor(() => {
      expect(getByTestId('title-input')).toBeTruthy();
    });
  });
});
