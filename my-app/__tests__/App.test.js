import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render HomeScreen initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Mis Deudas')).toBeTruthy();
    expect(getByText('No hay deudas para mostrar.')).toBeTruthy();
  });

  it('should navigate to AddDebtScreen on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId, getAllByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
      await Promise.resolve();
    });

    expect(getAllByText('Agregar Deuda').length).toBeGreaterThan(0);
  });
});