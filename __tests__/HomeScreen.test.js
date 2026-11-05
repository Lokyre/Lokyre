import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { DebtProvider } from '../src/context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderWithContext = async (ui) => {
  let result;
  await act(async () => {
    result = render(
      <DebtProvider>
        <PaperProvider>
          <NavigationContainer>
            {ui}
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    );
  });
  return result;
};

describe('HomeScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with no debts initially', async () => {
    await renderWithContext(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    expect(screen.getByText('$0.00')).toBeTruthy();
    expect(screen.getByText('No hay deudas registradas.')).toBeTruthy();
  });
});
