import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and allows adding a debt', async () => {
    const { getByText, getByTestId, getAllByText } = render(<App />);

    await waitFor(() => {
        expect(getByText('No hay deudas registradas.')).toBeTruthy();
    }, { timeout: 2000 });

    const fab = getByTestId('add-debt-fab');
    fireEvent.press(fab);

    await waitFor(() => {
        const elements = getAllByText('Agregar Deuda');
        expect(elements.length).toBeGreaterThan(0);
    });
  });
});
