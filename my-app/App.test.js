import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import App from './App';

describe('App Integration Tests', () => {
  it('renders the initial layout and loads debts', async () => {
    const component = render(<App />);

    // Wait for the context to load debts from AsyncStorage
    await act(async () => {
      await Promise.resolve();
    });

    const { getByText, queryByText } = component;

    expect(getByText('Mis Deudas')).toBeTruthy();
    expect(getByText('Total: $0.00')).toBeTruthy();
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });
});
