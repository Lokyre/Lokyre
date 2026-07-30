import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { DebtProvider } from '../src/context/DebtContext';
import HomeScreen from '../src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and shows empty state', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText } = render(
      <NavigationContainer>
        <DebtProvider>
          <HomeScreen />
        </DebtProvider>
      </NavigationContainer>
    );

    await act(async () => { await Promise.resolve(); });

    await waitFor(() => {
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
    });
  });
});
