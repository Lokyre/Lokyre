import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

describe('Debt Management App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and loads empty state', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Mis Deudas')).toBeTruthy();
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });
});
