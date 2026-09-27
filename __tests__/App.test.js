import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import { DebtProvider } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

describe('App Flow', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
  });

  it('renders home screen initially', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Resumen de Deudas')).toBeTruthy();
      expect(getByText('Mis Deudas')).toBeTruthy();
    });
  });
});
