import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from '../screens/AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('AddDebtScreen', () => {
  it('allows adding a new debt', async () => {
    const mockAddDebt = jest.fn();

    const { getByText, UNSAFE_getAllByType } = render(
      <SafeAreaProvider>
        <NavigationContainer>
          <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
            <AddDebtScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const { getByTestId } = render(
      <SafeAreaProvider>
        <NavigationContainer>
          <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
            <AddDebtScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.changeText(getByTestId('input-title'), 'Nueva Deuda');
      fireEvent.changeText(getByTestId('input-amount'), '200');
    });

    await act(async () => {
      fireEvent.press(getByTestId('btn-save'));
    });

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nueva Deuda',
      amount: 200,
    }));
  });
});
